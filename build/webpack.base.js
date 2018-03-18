const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'), // 打包好之后的输出路径
    publicPath: '/public/', // 静态资源文件引用时的路径（加在引用静态资源前面的） （更好的区分什么时候返回静态路径，什么时候返回服务端代码）
  },
  resolve: {
    extensions: ['.js', '.jsx']  // 省略.js及.jsx后缀名
  },
  // 配置loader
  module: {
    rules: [
      {
        enforce: 'pre',   // 编译之前去执行
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
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
