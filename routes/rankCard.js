const knights = require("knights-canvas")
const fs = require("fs")

module.exports.routes = {
  name: "Rank Card",
  desc: "Generate a rank card image with avatar, XP, level, and background stats.",
  category: "Canvas",
  usages: "/api/rankcard",
  query: "?id=UID&name=YourName&exp=100&level=2&bg=10",
  method: "get"
}

module.exports.onAPI = async (req, res) => {
  const { id, name, exp, level, bg } = req.query

  if (!id || !name) {
    return res.json({ status: false, error: "Missing 'id' or 'name' parameter." })
  }

  const userId = id
  const username = name
  const currentXp = parseInt(exp) || 0
  const userLevel = parseInt(level) || 1
  const bgScore = parseInt(bg) || 0
  const requiredXp = Math.floor(5 * Math.pow(userLevel, 2))
  const avatarUrl = `https://ccproject.serv00.net/other/fbprofile.php?id=${userId}`
  const rankBadge = "https://files.catbox.moe/rfj1ah.png"
  const background = "https://files.catbox.moe/gyxrif.jpeg"

  try {
    if (!fs.existsSync("./public")) {
      fs.mkdirSync("./public", { recursive: true })
    }

    const image = await new knights.Rank()
      .setAvatar(avatarUrl)
      .setUsername(username)
      .setBg(background)
      .setNeedxp(requiredXp.toString())
      .setCurrxp(currentXp.toString())
      .setLevel(userLevel.toString())
      .setRank(rankBadge)
      .setBg(bgScore.toString())
      .toAttachment()

    const timestamp = Date.now()
    const filename = `rankcard-${timestamp}.png`
    const outputPath = `./public/${filename}`

    fs.writeFileSync(outputPath, image.toBuffer())

    res.json({
      status: true,
      imageUrl: `${req.protocol}://${req.get("host")}/${filename}`,
      author: "Jonell Hutchin Magallanes"
    })
  } catch (err) {
    res.json({ status: false, error: "Failed to generate rank card", details: err.message })
  }
}
