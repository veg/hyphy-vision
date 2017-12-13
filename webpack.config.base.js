const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'HyPhy Vision'
    })
  ],
  devServer: {
    contentBase: '.'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  output: {
    filename: 'spa/bundle.js',
    path: path.resolve(__dirname)
  }
};
