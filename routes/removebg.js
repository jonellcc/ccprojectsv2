const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const apiKeys = [
    "DABuioDTVc19SqDGaWS7CjYy", "ToQX2FRYSXjWGSvmL5vNCzvT", "K2mEzPfotSS9wa5HdqadHhr6", 
    "mQuPKWdMNTFjw1g3LhmJBdH4", "zCUdE9DNjNGiUat2HGvpvSut", "AvrQA8iowvh4fSZhA7QksL7N", "5Wc8hyf8hMLk8kba3ZbEfiXb"
];

function getRandomApiKey() {
    const randomIndex = Math.floor(Math.random() * apiKeys.length);
    return apiKeys[randomIndex];
}

async function removeBg(imageURL) {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_url", imageURL);

    const apiKey = getRandomApiKey();

    try {
        const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
            headers: {
                ...formData.getHeaders(),
                "X-Api-Key": apiKey,
            },
            responseType: 'arraybuffer',
        });

        return response.data;
    } catch (error) {
        throw new Error(`${error.response.status}: ${error.response.statusText}`);
    }
}

module.exports.routes = {
    name: "Remove Background",
    desc: "Removes the background from an image",
    category: "Tools",
    usages: "/api/removebg",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const imageURL = req.query.url;

    if (!imageURL) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        const rbgResultData = await removeBg(imageURL);
        const outputFilePath = path.join(__dirname, 'no-bg.png');
        fs.writeFileSync(outputFilePath, Buffer.from(rbgResultData));

        res.sendFile(outputFilePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Error sending file' });
            } else {
                console.log('Image sent successfully!');
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: `Error: ${error.message}` });
    }
};
