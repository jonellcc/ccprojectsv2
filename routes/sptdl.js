const axios = require('axios');

module.exports.routes = {
  name: "Spotify",
  desc: "Spotify track download",
  category: "Downloader",
  query: "?url=",
  usages: "/api/spotify",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ message: "Please provide a valid Spotify URL." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/spotifyv2?url=${url}`);
    if (response.data.status) {
      const { songTitle, artist, coverImage, mp3DownloadLink } = response.data.data;

      res.json({
        songTitle: songTitle,
        artist: artist,
        coverImage: coverImage,
        mp3DownloadLink: mp3DownloadLink
      });
    } else {
      res.status(400).json({ message: "Failed to fetch Spotify data." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
