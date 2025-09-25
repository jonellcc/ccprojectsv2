const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.routes = {
	name: "Imagine AI",
	desc: "Generates an image based on a prompt ",
	category: "AI",
	usages: "/api/imagine",
	query: "?prompt=",
	method: "get",
};

module.exports.onAPI = async (req, res) => {
	const prompt = req.query.prompt;

	if (!prompt) {
		return res.status(400).json({ error: 'Prompt is required.' });
	}

	try {
		const apiURL = `http://de01.uniplex.xyz:5611/imagine?prompt=${encodeURIComponent(prompt)}`;

		const response = await axios.get(apiURL, { responseType: 'arraybuffer' });

		const filePath = path.join(__dirname, 'imagine_ai_image.png');

		fs.writeFileSync(filePath, Buffer.from(response.data));

		res.sendFile(filePath, (err) => {
			if (err) {
				res.status(500).json({ error: 'Error sending the image file.' });
			}

			fs.unlink(filePath, (unlinkErr) => {
				if (unlinkErr) {
					console.error('Error deleting the file:', unlinkErr.message);
				}
			});
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};