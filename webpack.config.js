const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = (env) => {
  config = {
    devtool: "source-map",
    mode: "development",
    entry: {
      hyphyvision: ["./src/index.js"],
    },
    devServer: {
      contentBase: ".",
      historyApiFallback: true,
      disableHostCheck: true,
    },
    output: {
      path: path.resolve(__dirname, "dist/"),
      filename: "[name].js",
      library: "hyphyVision",
      hashFunction: "xxhash64",
      // Asset and chunk names are content hashes, so remove the previous
      // build's files instead of leaving stale ones in dist/.
      clean: true,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    module: {
      rules: [
        {
          test: /\.(sass|scss|css)$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: { implementation: require("sass") },
            },
          ],
        },
        {
          test: /\.(js|jsx)?$/,
          include: [path.resolve(__dirname, "src")],
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.js$/,
          loader: require.resolve("@open-wc/webpack-import-meta-loader"),
        },
        {
          test: require.resolve("jquery"),
          loader: "expose-loader",
          options: {
            exposes: {
              globalName: ["jQuery", "$"],
              override: false,
            },
          },
        },
        {
          test: require.resolve("d3"),
          loader: "expose-loader",
          options: {
            exposes: {
              globalName: "d3",
              override: true,
            },
          },
        },
        {
          test: require.resolve("underscore"),
          loader: "expose-loader",
          options: {
            exposes: {
              globalName: "_",
              override: true,
            },
          },
        },
        // Fonts and images use webpack 5 asset modules instead of
        // url-loader/file-loader. Those loaders hash file names with MD4 via
        // node's crypto, which OpenSSL 3 rejects unless node runs with
        // --openssl-legacy-provider (a flag older nodes refuse). Asset modules
        // hash with output.hashFunction, so the build needs no flag.
        {
          test: /\.woff(2)?(\?\S*)?$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 10000,
            },
          },
        },
        {
          test: /\.(eot|ttf|svg|png|jpg|gif)(\?\S*)?$/,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new ESLintPlugin({
        files: "src/**/*.js",
        exclude: ["/node_modules/"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new PreloadWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "HyPhy Vision",
        filename: path.resolve("dist", "index.html"),
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new webpack.LoaderOptionsPlugin({ debug: true }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        d3: "d3",
        datamonkey: "datamonkey",
        _: "underscore",
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /jsdom$/,
      }),
      new CopyWebpackPlugin({ patterns: [{ from: "data", to: "data" }] }),
    ],
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        zlib: require.resolve("browserify-zlib"),
        util: require.resolve("util/"),
        process: require.resolve("process/"),
        stream: require.resolve("stream-browserify"),
      },
      alias: {
        "phylotree.css": __dirname + "/node_modules/phylotree/phylotree.css",
      },
      modules: ["src", "node_modules"],
      extensions: [".json", ".js", ".jsx", ".scss"],
    },
  };

  return config;
};
