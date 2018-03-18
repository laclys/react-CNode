const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs')  // 从内存中读取信息
const ReactDomServer = require('react-dom/server')
const proxy = require('http-proxy-middleware')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor
const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs // 通过memory-fs进行读写 (内存读写比硬盘读写快很多)

let serverBundle

serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats= stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js') //动态编译需要指定一个文件名。不然他无法在缓存中存储这部分内容
  serverBundle = m.exports.default
})

module.exports = function (app) {
  // 只要是/public开头的所有请求，都把它代理到webpack dev server那边
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function(req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!--app-->', content))
    })
  })
}