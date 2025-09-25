const axios = require('axios');

module.exports.routes = {
  name: "YouTube Audio Downloader",
  desc: "Download YouTube videos as MP3 audio files",
  category: "Downloader",
  query: "?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  usages: "/api/audiomp3",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ message: "Please provide a valid 'url' for the YouTube video." });
  }

  const apiUrl = `https://yt-manager-dl-cc.vercel.app/api/audio?url=${encodeURIComponent(url)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.download) {
      res.json({
        title: response.data.title,
        downloadUrl: response.data.download,
        type: response.data.type,
      });
    } else {
      res.status(500).json({ message: "Failed to fetch audio download link." });
    }
  } catch (error) {
    console.error('Error calling YouTube Audio Downloader API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
