const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

module.exports.routes = {
    name: "LitterBox",
    desc: "Uploads a file to Litterbox (temporary Catbox Moe storage)",
    category: "File Management",
    usages: "/api/litterbox",
    method: "get",
    query: "?url=",
};

module.exports.onAPI = async (req, res) => {
    const url = req.originalUrl.split('/api/litterbox?url=')[1];;

    if (!url) {
        return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    try {
        const ext = path.extname(new URL(url).pathname);
        if (!ext) {
            return res.status(400).json({ error: "Unable to detect file extension" });
        }

        const saveDir = path.join(__dirname, "public");
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        const timestamp = Date.now();
        const filePath = path.join(saveDir, `${timestamp}${ext}`);

        let response;
        try {
            response = await axios.get(url, { responseType: "stream" });
        } catch {
            response = await axios.get(url, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);
        }

        if (response.data.pipe) {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
        }

        const form = new FormData();
        form.append("time", "72h");
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(filePath));

        const uploadResponse = await axios.post("https://litterbox.catbox.moe/resources/internals/api.php", form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "sec-ch-ua-platform": '"Android"',
                "cache-control": "no-cache",
                "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                "sec-ch-ua-mobile": "?1",
                "x-requested-with": "XMLHttpRequest",
                "dnt": "1",
                "origin": "https://litterbox.catbox.moe",
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "sec-fetch-dest": "empty",
                "referer": "https://litterbox.catbox.moe/",
                "accept-language": "en-US,en;q=0.9,id;q=0.8,fil;q=0.7",
                "priority": "u=1, i"
               // "Cookie": "PHPSESSID=toci76vpocf3bd9vd5mjcdtf5u"
            },
        });

        const uploadedFileUrl = uploadResponse.data;

        fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete file:", err);
        });

        res.json({ fileUrl: uploadedFileUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload file", details: error.message });
    }
};
