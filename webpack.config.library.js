const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CopyPlugin = require("copy-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");

module.exports = env => {
  config = {
    devtool: "source-map",
    entry: {
      hyphyvision: ["./src/library-entry.js"]
    },
    devServer: {
      contentBase: ".",
      historyApiFallback: true,
      disableHostCheck: true
    },
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: "[name].js",
      library: "hyphyVision",
      libraryTarget: "umd"
    },
    externals: [/^[a-z\.\-0-9]+$/],
    module: {
      rules: [
        {
          test: /\.(sass|scss|css)$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: { implementation: require("sass") }
            }
          ]
        },
        {
          test: /\.(js|jsx)?$/,
          include: [path.resolve(__dirname, "src")],
          use: {
            loader: "babel-loader"          
          },
        },
        {
          test: /\.js$/,
          loader: require.resolve("@open-wc/webpack-import-meta-loader")
        },
        {
          test: require.resolve("jquery"),
          loader: "expose-loader",
          options: {
            exposes : { 
              globalName: ["jQuery", "$"],
              override: false
            }
          },
        },
        {
          test: require.resolve("d3"),
          loader: "expose-loader",
          options: {
            exposes : {
              globalName: "d3",
              override: true
            },
          },

        },
        {
          test: require.resolve("underscore"),
          loader: "expose-loader",
          options: {
            exposes : {
              globalName: "_",
              override: true
            },
          },
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                mimetype: "application/font-woff"
              },
            },
          ],
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
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new PreloadWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "HyPhy Vision",
        filename: path.resolve("dist", "index.html")
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.LoaderOptionsPlugin({ debug: true }),
      new webpack.IgnorePlugin(/jsdom$/),
      new CopyPlugin(
        { patterns: [
            // {output}/file.txt
            { from: "src/application.scss" },
            { from: "public/hyphyvision.css" }
          ]
        },
        {
          // By default, we only copy modified files during
          // a watch or webpack-dev-server build. Setting this
          // to `true` copies all files.
          copyUnmodified: true
        }
      )
    ],
    resolve: {
      fallback: { 
        "path": require.resolve("path-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "util": require.resolve("util/"),
        "process": require.resolve("process/"),
        "stream": require.resolve("stream-browserify")
      },
      alias: {
        "phylotree.css": __dirname + "/node_modules/phylotree/phylotree.css"
      },
      modules: ["src", "node_modules"],
      extensions: [".json", ".js", ".jsx", ".scss"]
    }
  };

  return config;
};
