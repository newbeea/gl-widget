const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production' || 'development',
  devServer:{
    contentBase:['dist', '.']
  },
  entry: {
    // index: "./src/app.ts",
    objLoader: './demo/obj-loader.ts'
  },
  output: {
    publicPath: "/", // 打包后资源文件的引用会基于此路径
    path: path.resolve(__dirname, "dist"), // 打包后的输出目录
    filename: "[name].bundle.js"
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
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.glsl', '.svg']
  },
  plugins:[
    // new HtmlWebpackPlugin({
    //   title: 'index',
    //   template: 'index.html',
    //   chunks: ['index']
    // }),
    new HtmlWebpackPlugin({
      title: 'obj-loader',
      filename: 'obj-loader.html',
      template: 'index.html',
      chunks: ['objLoader']
    })
]
}