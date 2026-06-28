const express = require('express')
const path = require('path')
const { createServer } = require('vite')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

;(async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
  app.use(vite.middlewares)

  app.get('*path', async (req, res) => {
    try {
      const html = await vite.transformIndexHtml(
        req.originalUrl,
        await fs.promises.readFile(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        )
      )
      res.send(html)
    } catch (e) {
      res.status(500).send('Server error')
    }
  })

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
  })
})()
