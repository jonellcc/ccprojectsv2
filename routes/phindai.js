const axios = require('axios');

module.exports.routes = {
    name: "Phind AI",
    desc: "Ask a question to Phind AI model",
    category: "AI",
    query: "?q=",
    usages: "/api/phindai",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: "Missing required parameter: q" });
        }

        const response = await axios.get(`https://free-ai-cc-api.vercel.app/ask?q=${encodeURIComponent(q)}&model=phind`);

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
