const axios = require('axios');

module.exports.routes = {
  name: "Apple Music",
  desc: "Apple Music track download",
  category: "Downloader",
  query: "?url=",
  usages: "/api/applemusic",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ message: "Please provide a valid URL." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/musicapple?url=${url}`);
    if (response.data.status) {
      const { songTitle, artist, artworkUrl, mp3DownloadLink } = response.data.data;

      res.json({
        songTitle: songTitle,
        artist: artist,
        artworkUrl: artworkUrl,
        mp3DownloadLink: mp3DownloadLink
      });
    } else {
      res.status(400).json({ message: "Failed to fetch Apple Music data." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
