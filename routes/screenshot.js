const API_KEY = '254572';

module.exports.routes = {
  name: "Screenshot Website",
  desc: "Takes a screenshot of a website based on the provided URL.",
  category: "Tools",
  usages: "/api/screenshot",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const screenshotURL = `https://api.screenshotmachine.com?key=${API_KEY}&url=${encodeURIComponent(url)}&dimension=1024x768`;

  res.json({ screenshotURL });
};
