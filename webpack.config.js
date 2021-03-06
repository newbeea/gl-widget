const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production' || 'development',
  devServer:{
    contentBase:['dist', '.']
  },
  entry: __dirname + '/src/index.ts',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: '@gl-widget/gl-widget',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
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
  ]
}