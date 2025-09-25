const axios = require('axios');

module.exports.routes = {
  name: "Soundcloud Downloader",
  desc: "Soundcloud music download",
  category: "Downloader",
  query: "?url=",
  usages: "/api/soundcloud",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ message: "Please provide a valid URL." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/soundcloud?url=${url}`);
    if (response.data.status) {
      const { title, url: downloadLink, thumbnail } = response.data.data;

      res.json({
        title: title,
        url: downloadLink,
        thumbnail: thumbnail
      });
    } else {
      res.status(400).json({ message: "Failed to fetch Soundcloud data." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
