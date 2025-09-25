const axios = require('axios');

module.exports.routes = {
    name: "Dictionary",
    desc: "Look up word definitions, phonetics, origins, and examples",
    category: "Educational",
    usages: "/api/dictio",
    query: "?q=hello",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const word = req.query.q || req.body.q;

    if (!word) {
        return res.status(400).json({ error: 'Please provide the "q" parameter for the word to look up.' });
    }

    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
            const entry = data[0];
            const phoneticAudio = entry.phonetics.find(p => p.audio) ? entry.phonetics.find(p => p.audio).audio : null;

            return res.json({
                status: true,
                word: entry.word,
                phonetic: entry.phonetic || null,
                phonetics: entry.phonetics || [],
                audio: phoneticAudio || null,
                origin: entry.origin || null,
                meanings: entry.meanings || []
            });
        } else {
            return res.status(404).json({
                status: false,
                error: 'No dictionary entry found for the given word.'
            });
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: 'An error occurred while processing your request.' });
    }
};
