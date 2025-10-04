const axios = require("axios");
const cheerio = require("cheerio");

module.exports.routes = {
    name: "Pinterest",
    desc: "Download Pinterest videos",
    category: "Downloader",
    usages: "/api/pinterest",
    query: "?url",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const pinUrl = req.query.url;
        if (!pinUrl) return res.json({ status: false, message: "Missing Pinterest URL" });

        const payload = new URLSearchParams({
            url: pinUrl,
            csrf_token: "MTc1OTU5MTMyNjowY2E0Zjg0MWFhMzVmMWYyMDI0YWEzNWRjMWQwYTg1MzMwNjRhMDcxZjg5MTI2NDEwMGRiOWFhNTI3NzBiZDIy"
        });

        const headers = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 13; Redmi 9A Build/TQ3A.230805.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.123 Mobile Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate",
            "cache-control": "max-age=0",
            "upgrade-insecure-requests": "1",
            "origin": "https://klickpin.com",
            "x-requested-with": "mark.via.gp",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "referer": "https://klickpin.com/",
            "accept-language": "en-US,en;q=0.9"
        };

        const response = await axios.post("https://klickpin.com/download", payload, { headers });
        const $ = cheerio.load(response.data);
        const downloadButton = $("a#dlMP4");

        if (!downloadButton.length) {
            return res.json({ status: false, message: "No downloadable video found." });
        }

        const onclickAttr = downloadButton.attr("onclick");
        const title = downloadButton.attr("title") || "Pinterest Video";

        const match = onclickAttr.match(/downloadFile\('([^']+)'/);
        const downloadUrl = match ? match[1] : null;

        if (!downloadUrl) {
            return res.json({ status: false, message: "Failed to extract download URL." });
        }

        res.json({
            status: true,
            title,
            url: downloadUrl
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};
