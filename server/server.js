const express =require('express')
const fs = require('fs')
const ReactSSR = require('react-dom/server')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const tplPath = path.join(__dirname, '../dist/index.html')
  const template = fs.readFileSync(tplPath, 'utf8') // 不指定utf-8,默认是buffer
  app.use('/public', express.static(path.join(__dirname, '../dist'))) //静态文件指定请求返回
  app.get('*', (req, res) => {
    const appStr = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!--app-->', appStr))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(2333, () => {
  console.log('server is listening on 2333')
})