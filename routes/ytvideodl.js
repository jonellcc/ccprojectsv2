const axios = require('axios');

module.exports.routes = {
  name: "YouTube Video Download",
  desc: "Download videos from YouTube",
  category: "Downloader",
  query: "?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  usages: "/api/ytvideodl",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ message: "Please provide a valid 'url' for the video." });
  }

  const apiUrl = `https://api.siputzx.my.id/api/d/savefrom?url=${encodeURIComponent(url)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data.status && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const videoTitle = response.data.data[0].title;
      const downloadOptions = response.data.data.map(item => ({
        quality: item.quality,
        format: item.format,
        type: item.type,
        url: item.url,
      }));

      res.json({
        title: videoTitle,
        sourceUrl: response.data.url,
        downloadOptions: downloadOptions
      });
    } else {
      res.status(404).json({ message: "Could not find any download links for the provided URL. The video might be private or unavailable." });
    }
  } catch (error) {
    console.error('Error calling YouTube Downloader API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
