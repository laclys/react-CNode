const path = require('path') // 引入‘path’，为了在这里使用绝对路径，避免相对路径在不同系统时出现不必要的问题

const webpackMerge = require('webpack-merge') //官方出品 专门用来合并webpack配置的 会检测webpack属性并选择最优的合并方案的
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig,{
  target: 'node', //webpack打包出来的内容使用在什么环境下
  // 应用入口
  entry: {
    app: path.join(__dirname, '../src/server-entry.js')  // app.js作为打包的入口
  },
  // 输出目录
  output: {
    filename: 'server-entry.js',  // node端没有浏览器缓存这个概念，并且需要在node中直接import这个文件。故直接命名就好
    libraryTarget: 'commonjs2' // 打包出来js模块所使用的方案（umd、amd、cmd、commonJS）这里我们使用commonjs2，适用于node端
  }
})
