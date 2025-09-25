const axios = require('axios');

module.exports.routes = {
    name: "TinyURL Shortener",
    desc: "Shorten a URL using TinyURL",
    category: "Tools",
    usages: "/api/tinyurl",
    query: "?url=https://example.com",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const originalUrl = req.query.url;

        if (!originalUrl) {
            return res.status(400).json({ error: 'Missing URL in query parameters' });
        }

        const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`;
        const response = await axios.get(apiUrl);

        const shortenedUrl = response.data;

        res.json({ originalUrl, shortenedUrl });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
