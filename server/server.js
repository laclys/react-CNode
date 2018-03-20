const express = require('express')
const favicon = require('serve-favicon')
const fs = require('fs')
const ReactSSR = require('react-dom/server')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

// 对应表单请求
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
  maxAge: 10 * 60 * 1000,  // 10min
  name: 'tid', // cookie id
  resave: false, // 每次请求是否都需要申请一个cookie id
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

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
