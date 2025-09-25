const axios = require('axios');

module.exports.routes = {
  name: "Spotify",
  desc: "Search for music on Spotify",
  category: "Search",
  query: "?query={q}",
  usages: "/api/spotifysearch?query=serana",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Please provide a 'query' (q) for the search." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/s/spotify?query=${encodeURIComponent(query)}`);

    if (response.data.status && Array.isArray(response.data.data)) {
      const searchResults = response.data.data.map(item => ({
        track_url: item.track_url,
        thumbnail: item.thumbnail,
        title: item.title,
        artist: item.artist,
        duration: item.duration,
        album: item.album,
        release_date: item.release_date
      }));

      res.json({
        results: searchResults,
        total_results: response.data.total_results
      });
    } else {
      res.status(404).json({ message: "No results found for the query." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
