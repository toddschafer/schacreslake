const glob = require('glob')
const jimp = require('jimp')

const generateSmallImages = (config) => {
  glob(`${config.inputPath}/*{gif,jpg,jpeg,png}`, async (error, filepaths) => {
    if (error) return

    for (let i = 0; i < filepaths.length; i += 1) {
      const filepath = filepaths[i]
      const filename = filepath.split('/').pop()
      const image = await jimp.read(`${config.inputPath}${filename}`)
      image.resize(config.width, jimp.AUTO).write(`${config.outputPath}${filename}`)
    }
  })
}

const main = () => {
  generateSmallImages({
    inputPath: './static/images/uploads/',
    outputPath: './public/images/uploads_small/',
    width: 400,
  })
}

main()
