const axios = require('axios');

module.exports.routes = {
  name: "Waifu",
  desc: "Waifu images or information about waifus based on search query using waifu.",
  category: "Search",
  usages: "/api/waifu",
  query: "?search=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).send('Search query parameter is required');
  }

  const url = `https://api.waifu.im/search?q=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.set('Access-Control-Allow-Origin', '*');

    res.json({ 
      data,
      message: "Developed by Joshua Apostol"
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching the data');
  }
};
