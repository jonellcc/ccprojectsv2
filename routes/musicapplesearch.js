const axios = require('axios');

module.exports.routes = {
  name: "Apple Music",
  desc: "Search for music on Apple Music",
  category: "Search",
  query: "?query=&region=",
  usages: "/api/applemusicsearch",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const title = req.query.query;
  const region = req.query.region || 'ph'; 

  if (!title) {
    return res.status(400).json({ message: "Please provide a 'query' (title) for the search." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/s/applemusic?query=${encodeURIComponent(title)}&region=${encodeURIComponent(region)}`);

    if (response.data.status && Array.isArray(response.data.data)) {
      
      const searchResults = response.data.data.map(item => ({
        title: item.title,
        artist: item.artist,
        link: item.link,
        image: item.image
      }));

      res.json({
        results: searchResults
      });
    } else {
      res.status(404).json({ message: "No results found for the query." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
