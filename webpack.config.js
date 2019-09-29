const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production' || 'development',
  devServer:{
    contentBase:'dist',
  },
  entry: {
    index: "./src/app.ts"
  },
  output: {
    publicPath: "/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "app.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.glsl$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.glsl']
  },
  plugins:[
    new HtmlWebpackPlugin({
      title: 'Hello World app',
      template: 'index.html'
    })
]
}