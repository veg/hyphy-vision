var path = require("path"),
  webpack = require("webpack"),
  cloneDeep = require("lodash.clonedeep"),
  CopyWebpackPlugin = require('copy-webpack-plugin');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

config = {
  devtool: "source-map",
  entry: {
    hyphyvision: ["./src/library-entry.js"],
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "[name].js",
    library : "hyphyVision",
    libraryTarget : "umd"
  },
  externals: [
    /^[a-z\.\-0-9]+$/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        include:[
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/csvexport")
        ],
        loaders: "babel-loader",
        query: {
          presets: ["react"]
        }
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff" }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/octet-stream" }
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loaders: "file-loader" },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loaders: "url-loader",
        options: { limit: 10000, mimetype: "image/svg+xml" }
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {}
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.IgnorePlugin(/jsdom$/),
    new ExtractTextPlugin("[name].css"),
		new CopyWebpackPlugin([
				// {output}/file.txt
				{ from: 'src/application.scss' }
		], {
				// By default, we only copy modified files during
				// a watch or webpack-dev-server build. Setting this
				// to `true` copies all files.
				copyUnmodified: true
		})
  ],
  resolve: {
    alias: {
      dc: __dirname + "/node_modules/dc/dc.min.js",
      "dc.css": __dirname + "/node_modules/dc/dc.min.css",
      "phylotree.css": __dirname + "/node_modules/phylotree/phylotree.css"
    },
    modules: ["src", "node_modules"],
    extensions: [".json", ".js", ".jsx", ".less"],
    symlinks: false
  }
};

if (process.env.NODE_ENV === "production") {
  config.devtool = false;
  config.debug = false;
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = [config];
