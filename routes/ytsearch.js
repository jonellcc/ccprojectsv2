const axios = require('axios');

module.exports.routes = {
  name: "YouTube Video Search",
  desc: "Search for videos on YouTube",
  category: "Search",
  query: "?title=Toma no Bilao,
  usages: "/api/ytsearch",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const query = req.query.title;

  if (!query) {
    return res.status(400).json({ message: "Please provide a 'title' (search query) for the YouTube search." });
  }

  const apiUrl = `https://yt-manager-dl-cc.vercel.app/api/search?title=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && Array.isArray(response.data.results)) {
      const searchResults = response.data.results.map(item => ({
        videoId: item.videoId,
        title: item.title,
        url: item.url,
        thumbnail: item.thumbnail,
        duration: item.timestamp,
        views: item.views,
        publishedAgo: item.ago,
        author: item.author.name,
        authorUrl: item.author.url
      }));

      res.json({
        results: searchResults
      });
    } else {
      res.status(404).json({ message: "No YouTube results found for the query." });
    }
  } catch (error) {
    console.error('Error calling YouTube Search API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
