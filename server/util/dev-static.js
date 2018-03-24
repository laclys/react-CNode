const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs') // 从内存中读取信息 和fs API一模一样
const proxy = require('http-proxy-middleware')
const serverConfig = require('../../build/webpack.config.server')

const serverRender = require('./server-render')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

// const Module = module.constructor
const NativeModule = require('module')
const vm = require('vm')

const getModuleFromString = (bundle, filename) => {
  const m = {
    exports: {}
  }
  const wrapper = NativeModule.wrap(bundle) // 将可执行的JS代码进行包装 => (function(exports, require, module,  __filename, __dirname){bundle code})
  const script = new vm.Script(wrapper, { // 让包裹起来的代码跑起来
    filename: filename,
    displayErrors: true,
  })
  const result = script.runInThisContext() // 指定执行环境 （使用当前的context）
  result.call(m.exports, m.exports, require, m) // 让执行完的代码 全部附在m对象上
  return m
}


const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig) // webpack在node中调用
serverCompiler.outputFileSystem = mfs // 通过memory-fs进行读写，加快他的打包速度 (内存读写比硬盘读写快很多)

let serverBundle

// 目的是拿到打包下来的内容 (监听服务端)
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // 编译出来是一串字符串
  // hack：通过new一个Moudle，通过——compile转化字符串，成为nodeJs可以使用的moudle
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js') //动态编译需要指定一个文件名。不然他无法在缓存中存储这部分内容
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})
module.exports = function (app) {
  // 只要是/public开头的所有请求，都把它代理到webpack dev server那边
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res, next) {
    if (!serverBundle) return res.send('waiting for compile, refresh later')
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
