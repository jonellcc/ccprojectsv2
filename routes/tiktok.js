const express = require('express');
const axios = require('axios');

module.exports.routes = {
		name: "TikTok Video Search",
		desc: "Search for TikTok videos based on keywords.",
		category: "Search",
		usages: "/api/tiktok/searchvideo",
		query: "?keywords=",
		method: "get",
};

module.exports.onAPI = async (req, res) => {
		const search = req.query.keywords;
		if (!search) return res.status(400).json({ error: 'Missing data to launch the program' });

		try {
				const response = await axios.post('https://www.tikwm.com/api/feed/search', {
						keywords: search
				});

				const data = response.data;
				if (data.data.videos.length === 0) {
						return res.status(404).json({ error: 'No videos found for the given search.' });
				}

				const randomIndex = Math.floor(Math.random() * data.data.videos.length);
				const randomVideo = data.data.videos[randomIndex];
				const result = {
						code: 0,
						msg: 'success',
						processed_time: 0.9624,
						data: {
								videos: [randomVideo]
						}
				};
				return res.json(result);
		} catch (error) {
				return res.status(500).json({ error: 'Internal server error' });
		}
};
