const axios = require('axios');

module.exports.routes = {
  name: "Image Upscaler",
  desc: "Upscale an image to a larger size",
  category: "Tools",
  query: "?url={url}&scale={scale}",
  usages: "/api/tools/upscale?url=https://example.com/image.jpg&scale=2",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const imageUrl = req.query.url;
  const scale = req.query.scale;

  if (!imageUrl) {
    return res.status(400).json({ message: "Please provide a valid image URL." });
  }

  const upscaleFactor = parseInt(scale, 10);
  if (isNaN(upscaleFactor) || upscaleFactor < 1 || upscaleFactor > 20) {
    return res.status(400).json({ message: "Please provide a valid upscale 'scale' between 1 and 20." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/tools/upscale?url=${encodeURIComponent(imageUrl)}&scale=${upscaleFactor}`, {
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error during image upscaling:', error.message);
    res.status(500).json({ error: 'Failed to upscale the image. Please check the URL or try again later.' });
  }
};
