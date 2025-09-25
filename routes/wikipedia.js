const wiki = require('wikipedia');

module.exports.routes = {
    name: "Wikipedia",
    desc: "Searching Wikipedia article summary",
    category: "Educational",
    usages: "/api/wiki",
    query: "?q=agriculture",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const page = await wiki.page(query);
        const summary = await page.summary();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
};
