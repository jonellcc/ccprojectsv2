const axios = require("axios");

module.exports.routes = {
    name: "Earthquake Information",
    desc: "Get earthquake data from USGS based on country and date",
    category: "Tools",
    usages: "/api/earthquake",
    query: "?country=Philippines&date=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const country = req.query.country || "Philippines";
        const date = req.query.date || new Date().toISOString().split("T")[0];

        const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: country,
                format: "json",
                limit: 1
            },
            headers: { "User-Agent": "earthquake-api-example" }
        });

        if (!geoRes.data || geoRes.data.length === 0) {
            return res.json({ status: false, message: "Invalid country name" });
        }

        const latitude = geoRes.data[0].lat;
        const longitude = geoRes.data[0].lon;
        const maxradiuskm = 1000;

        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${date}&minmagnitude=4.5&latitude=${latitude}&longitude=${longitude}&maxradiuskm=${maxradiuskm}`;
        const eqRes = await axios.get(url);

        res.json({
            status: true,
            country,
            date,
            count: eqRes.data.metadata.count,
            data: eqRes.data.features.map(eq => ({
                place: eq.properties.place,
                magnitude: eq.properties.mag,
                time: new Date(eq.properties.time).toISOString(),
                url: eq.properties.url
            }))
        });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
};
