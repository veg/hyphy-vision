const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");

module.exports = env => {
  config = {
    devtool: "source-map",
    entry: {
      hyphyvision: ["./src/index.js"]
    },
    devServer: {
      contentBase: ".",
      historyApiFallback: true
    },
    output: {
      path: path.resolve(__dirname, "public/"),
      filename: "[name].js",
      library: "hyphyVision"
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: "/dist/", minimize: false }
            },

            "css-loader"
          ]
        },
        {
          test: /\.(js|jsx)?$/,
          include: [path.resolve(__dirname, "src")],
          loaders: "babel-loader",
          query: {
            presets: ["@babel/preset-env"]
          }
        },
        {
          test: require.resolve("jquery"),
          use: [
            {
              loader: "expose-loader",
              query: "jQuery"
            },
            {
              loader: "expose-loader",
              query: "$"
            }
          ]
        },
        {
          test: require.resolve("d3"),
          use: [
            {
              loader: "expose-loader",
              query: "d3"
            }
          ]
        },
        {
          test: require.resolve("underscore"),
          use: [
            {
              loader: "expose-loader",
              query: "_"
            }
          ]
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&mimetype=application/font-woff"
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)(\?\S*)?$/,
          use: [
            {
              loader: "file-loader"
            }
          ]
        },
        {
          test: /\.(js|jsx)?$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {}
        },
        {
          test: /\.scss$/i,
          include: [path.resolve(__dirname, "src")],
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    },
    plugins: [
      new PreloadWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "HyPhy Vision",
        filename: path.resolve("public", "index.html")
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.LoaderOptionsPlugin({ debug: true }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        d3: "d3",
        datamonkey: "datamonkey",
        _: "underscore"
      }),
      new webpack.IgnorePlugin(/jsdom$/)
    ],
    resolve: {
      alias: {
        "phylotree.css": __dirname + "/node_modules/phylotree/phylotree.css"
      },
      modules: ["src", "node_modules"],
      extensions: [".json", ".js", ".jsx", ".scss"]
    }
  };

  return config;
};
