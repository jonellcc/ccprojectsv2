const axios = require('axios');

module.exports.routes = {
  name: "Shoti",
  desc: "A random Shoti girls (short video)",
  category: "Entertainment",
  query: "",
  usages: "/api//shoti",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const apiUrl = `http://shotiapi.joncll.serv00.net/shoti.php`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.download) {
      const shotiData = response.data;


      res.json({
        username: shotiData.username,
        description: shotiData.desc,
        region: shotiData.region,
        thumbnail: shotiData.thumbnail,
        downloadUrl: shotiData.download
      });
    } else {
      res.status(500).json({ message: "Failed to fetch Shoti video data." });
    }
  } catch (error) {
    console.error('Error calling Shoti API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
