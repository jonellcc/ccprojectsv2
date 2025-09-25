const googlethis = require("googlethis");

module.exports.routes = {
    name: "Image Search",
    desc: "Search images from Google Image results.",
    category: "Search",
    query: "?title=wallpaper&count=3&safe=true",
    usages: "/api/imagesearch",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const { title, count, safe } = req.query;

    if (!title) {
        return res.status(400).json({ error: "Missing 'title' parameter" });
    }

    const searchQuery = title;
    const imageCount = parseInt(count) || 3;
    const safeSearch = safe === "true";

    try {
        const images = await googlethis.image(searchQuery, { safe: safeSearch });
        res.json({ results: images.slice(0, imageCount) });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
};
