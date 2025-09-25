const axios = require('axios');

module.exports.routes = {
  name: "Soundcloud",
  desc: "Search for music on Soundcloud",
  category: "Search",
  query: "?query={q}",
  usages: "/api/soundcloudsearch?query=c2 na red",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Please provide a 'query' (q) for the search." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/s/soundcloud?query=${encodeURIComponent(query)}`);

    if (response.data.status && Array.isArray(response.data.data)) {
      const searchResults = response.data.data.map(item => ({
        title: item.permalink,
        artist: "Unknown", // The API response doesn't explicitly give an artist name, so this is a placeholder based on the example. You might need to adjust this depending on your needs.
        link: item.permalink_url,
        image: item.artwork_url,
        genre: item.genre,
        duration: item.duration,
        playback_count: item.playback_count
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
