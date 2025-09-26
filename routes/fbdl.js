const getFBInfo = require("@xaviabot/fb-downloader");

module.exports.routes = {
  name: "Facebook Video Downloader",
  desc: "Download videos from Facebook using the video URL.",
  category: "Downloader",
  query: "?url=",
  usages: "/api/fbdl",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ message: "Please provide a valid Facebook video 'url'." });
  }

  try {
    const result = await getFBInfo(url);

    let downloadUrl = null;

    if (result.hd && result.hd.url) {
      downloadUrl = result.hd.url;
    } else if (result.sd && result.sd.url) {
      downloadUrl = result.sd.url;
    }

    if (downloadUrl) {
      const title = result.title || "Unknown Title";
      res.json({
        title: title,
        downloadUrl: downloadUrl
      });
    } else {
      res.status(404).json({ message: "No downloadable link found for this video. Ensure the video is public." });
    }

  } catch (error) {
    console.error('Error in Facebook Downloader:', error.message);
    res.status(500).json({ error: 'Failed to process the request, please check if the URL is correct or if the video is public.' });
  }
};
