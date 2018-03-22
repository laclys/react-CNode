const webpack = require('webpack')
const path = require('path') // 引入‘path’，为了在这里使用绝对路径，避免相对路径在不同系统时出现不必要的问题
const HTMLPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge') //官方出品 专门用来合并webpack配置的 会检测webpack属性并选择最优的合并方案的
const baseConfig = require('./webpack.base')

const isDev = process.env.NODE_ENV === 'development' // 判断是否为开发环境

const config = webpackMerge(baseConfig, {
  // 应用入口
  entry: {
    app: path.join(__dirname, '../src/app.js')  // app.js作为打包的入口
  },
  // 输出目录
  output: {
    filename: '[name].[hash].js',  //name代表entry对应的名字; hash代表 整个app打包完成后根据内容加上hash。一旦整个文件内容变更，hash就会变化
  },
  plugins: [
    // 生成一个html页面，同时在webpack编译的时候。把我们所生成的entry都注入到这个html页面中,路径都是根据我们output配置的来走的。
    new HTMLPlugin({
      template: path.join(__dirname, '../src/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../src/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

if (isDev) {
  // entry可以是一个数组，将入口文件们打包成一个
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../src/app.js')
    ]
  }

  config.devServer = {
    host: '0.0.0.0',  // 我们可以允许我们用任意方式进行访问（ip，localhost）
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,  //启动 Hot module replacement
    overlay: {  // 错误提醒弹窗
      errors: true //只显示error
    },
    // 和output配置对应起来
    publicPath: '/public/',  // 访问所有静态路径都要前面加/public才能访问生成的静态文件
    historyApiFallback: {
      index: '/public/index.html' // 所有404的请求全部访问该配置下的url
    },
    proxy: {
      '/api': 'http://localhost:2333'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
