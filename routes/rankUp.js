const knights = require("knights-canvas")
const fs = require("fs")

module.exports.routes = {
  name: "Rank Up Card",
  desc: "Generates a rank-up card with avatar from Facebook UID.",
  category: "Canvas",
  usages: "/api/rankup",
  query: "?id=",
  method: "get"
}

module.exports.onAPI = async (req, res) => {
  const { id } = req.query

  if (!id) {
    return res.json({ status: false, error: "Missing required parameter: 'id'" })
  }

  const avatarUrl = `https://ccproject.serv00.net/other/fbprofile.php?id=${id}`

  try {
    if (!fs.existsSync("./public")) {
      fs.mkdirSync("./public", { recursive: true })
    }

    const image = await new knights.Up().setAvatar(avatarUrl).toAttachment()

    const timestamp = Date.now()
    const filename = `rankup-${timestamp}.png`
    const outputPath = `./public/${filename}`

    fs.writeFileSync(outputPath, image.toBuffer())

    res.json({
      status: true,
      imageUrl: `${req.protocol}://${req.get("host")}/${filename}`,
      author: "Jonell Hutchin Magallanes"
    })
  } catch (err) {
    res.json({ status: false, error: "Failed to generate image", details: err.message })
  }
}
