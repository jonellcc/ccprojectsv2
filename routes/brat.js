const axios = require('axios')
const fs = require('fs')

module.exports.routes = {
  name: "Brat",
  desc: "Get image brat text",
  category: "Canvas",
  query: "?text=here",
  usages: "/api/brat",
  method: "get"
}

module.exports.onAPI = async (req, res) => {
  const { text } = req.query

  if (!text) {
    return res.json({ status: false, error: "Please provide valid text." })
  }

  try {
    const response = await axios.get(
      `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isVideo=false&delay=51`,
      { responseType: 'arraybuffer' }
    )

    if (response.status === 200) {
      const timestamp = Date.now()
      const filename = `brat-${timestamp}.png`
      const filePath = `./public/${filename}`

      if (!fs.existsSync('../public')) {
        fs.mkdirSync('./public', { recursive: true })
      }

      fs.writeFileSync(filePath, response.data)

      res.json({
        status: true,
        bratImage: `${req.protocol}://${req.get('host')}/public/${filename}`,
        author: "Jonell Hutchin Magallanes"
      })
    } else {
      return res.json({ status: false, error: "Failed to get Brat response." })
    }
  } catch (error) {
    console.error('Error:', error.message)
    return res.json({ status: false, error: 'Internal Server Error' })
  }
}
