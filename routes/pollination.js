const express = require('express');
const axios = require('axios');

module.exports.routes = {
    name: "Pollination AI",
    desc: "Generate an image based on a prompt.",
    category: "AI Image",
    query: "?prompt=tree",
    usages: "/api/poli",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing parameter: prompt' });
    }

    try {
        const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
            responseType: 'arraybuffer',
        });

        res.set('Content-Type', 'image/jpeg'); 
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
