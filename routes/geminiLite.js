const axios = require('axios');

module.exports.routes = {
  name: "Gemini (Lite)",
  desc: "Interact with a Gemini model, optionally with an image",
  category: "AI",
  query: "?prompt=&imgUrl=",
  usages: "/api/ai/geminilite",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const prompt = req.query.prompt;
  const imageUrl = req.query.imgUrl;
  const model = 'gemini-2.0-flash-lite';

  if (!prompt) {
    return res.status(400).json({ message: "Please provide a 'prompt' (q) for the AI." });
  }

  let apiUrl = `https://api.siputzx.my.id/api/ai/gemini-lite?prompt=${encodeURIComponent(prompt)}&model=${encodeURIComponent(model)}`;

  if (imageUrl) {
    apiUrl += `&imgUrl=${encodeURIComponent(imageUrl)}`;
  }

  try {
    const response = await axios.get(apiUrl);

    if (response.data.status && response.data.data && response.data.data.parts && response.data.data.parts.length > 0) {
      const aiResponseText = response.data.data.parts[0].text;

      res.json({
        response: aiResponseText
      });
    } else {
      res.status(500).json({ message: "Failed to get a valid response from the AI API.", details: response.data });
    }
  } catch (error) {
    console.error('Error calling Gemini AI API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
