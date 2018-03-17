const path = require('path') // 引入‘path’，为了在这里使用绝对路径，避免相对路径在不同系统时出现不必要的问题

module.exports ={
  target: 'node', //webpack打包出来的内容使用在什么环境下
  // 应用入口
  entry: {
    app: path.join(__dirname, '../src/server-entry.js')  // app.js作为打包的入口
  },
  // 输出目录
  output: {
    filename: 'server-entry.js',  // node端没有浏览器缓存这个概念，并且需要在node中直接import这个文件。故直接命名就好
    path: path.join(__dirname, '../dist'), // 打包好之后的输出路径
    publicPath: '',
    libraryTarget: 'commonjs2' // 打包出来js模块所使用的方案（umd、amd、cmd、commonJS）这里我们使用commonjs2，适用于node端
  },
  // 配置loader
  module: {
    rules: [
      {
        test: /.(jsx)$/, //使用loader的目标文件。这里是.jsx
        loader: 'babel-loader'
      },
      {
        test: /.(js)$/, //使用loader的目标文件。这里是.js
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')  // 由于node_modules都是编译过的文件，这里我们不让babel去处理其下面的js文件
        ]
      }
    ]
  }
}