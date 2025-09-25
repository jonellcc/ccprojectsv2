const axios = require('axios');
const cheerio = require('cheerio');

module.exports.routes = {
    name: "Alight Motion Information",
    desc: "Get metadata from an Alight Motion link",
    category: "Tools",
    usages: "/api/am",
    query: "?alightLink",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const alightLink = req.query.alightlink;

        if (!alightLink) {
            return res.status(400).json({ error: 'Alight Motion link is required.' });
        }

        const { data } = await axios.get(alightLink);
        const $ = cheerio.load(data);
        
        const title = $('title').text();
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const ogImage = $('meta[property="og:image"]').attr('content');
        const ogDescription = $('meta[property="og:description"]').attr('content');
        const importLink = $('a.button').attr('href');
        
        const scrapedData = {
            title,
            ogTitle,
            ogImage,
            ogDescription,
            importLink
        };

        res.json(scrapedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape the data.' });
    }
};
