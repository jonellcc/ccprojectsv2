const axios = require("axios")
const fs = require("fs-extra")
const Canvas = require("canvas")

module.exports.routes = {
  name: "Facebook Stalker Card",
  desc: "Generates a Facebook profile card with avatar and name.",
  category: "Canvas",
  usages: "/api/stalkfb",
  query: "?id=100036956043695&name=Harold Hutchins",
  method: "get"
}

module.exports.onAPI = async (req, res) => {
  const { id, name } = req.query

  if (!id || !name) {
    return res.json({ status: false, error: "Missing required parameters: 'id' and 'name'" })
  }

  const background = "https://i.imgur.com/zQ7JY17.jpg"
  const fontlink = "https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download"
  const profilePicUrl = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`

  try {
    if (!fs.existsSync("./public")) {
      fs.mkdirSync("./public", { recursive: true })
    }

    const avatarData = (await axios.get(profilePicUrl, { responseType: "arraybuffer" })).data
    const fontBuffer = (await axios.get(fontlink, { responseType: "arraybuffer" })).data
    const fontPath = "../public/Semi.ttf"

    fs.writeFileSync("./public/avt.png", avatarData)
    fs.writeFileSync(fontPath, Buffer.from(fontBuffer))

    Canvas.registerFont(fontPath, { family: "Semi" })

    const avatar = await Canvas.loadImage("../public/avt.png")
    const canvas = Canvas.createCanvas(626, 352)
    const ctx = canvas.getContext("2d")

    const bg = await Canvas.loadImage(background)
    ctx.drawImage(bg, 0, 0, 626, 352)

    const size = 250
    const x = 90
    const y = (canvas.height - size) / 2
    const radius = 10

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + size - radius, y)
    ctx.arcTo(x + size, y, x + size, y + radius, radius)
    ctx.lineTo(x + size, y + size - radius)
    ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius)
    ctx.lineTo(x + radius, y + size)
    ctx.arcTo(x, y + size, x, y + size - radius, radius)
    ctx.lineTo(x, y + radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avatar, x, y, size, size)
    ctx.restore()

    let fontSize = 30
    ctx.font = `${fontSize}px Semi`
    while (ctx.measureText(name).width > size) {
      fontSize -= 2
      ctx.font = `${fontSize}px Semi`
    }

    ctx.fillStyle = "white"
    ctx.fillText(name, x + size / 2 - ctx.measureText(name).width / 2, y + size + fontSize + 10)

    const timestamp = Date.now()
    const filename = `stalkfb-${timestamp}.png`
    const outputPath = `./public/${filename}`

    fs.writeFileSync(outputPath, canvas.toBuffer("image/png"))

    res.json({
      status: true,
      imageUrl: `${req.protocol}://${req.get("host")}/${filename}`,
      author: "Jonell Hutchin Magallanes"
    })
  } catch (err) {
    res.json({ status: false, error: "Internal Server Error", details: err.message })
  }
}
