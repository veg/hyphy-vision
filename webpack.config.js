
path = require('path');
webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

config = {

  debug: true,
  devtool: 'source-map',
  entry: {
    app : './src/entry.js',
		vendor : [
							"bootstrap", 
							"crossfilter", 
							"d3",
							"dc",
							"font-awesome",
							"immutable",
							"jquery",
							"jquery-ui",
							"lodash",
							"phylotree",
							"react",
							"redux"
						 ]
  },
  output: {
    path: path.resolve(__dirname, 'src/public'),
    filename: '[name].js',
  },
	externals: {
		"jsdom":"window"
	},
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
		{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
		{ test: /jquery/, loader: 'expose?$!expose?jQuery' },
		{ test: /d3/, loader: 'expose?$!expose?d3' },
		{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
		{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		],

  },
  plugins: [
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
		new webpack.ProvidePlugin({
				$: "jquery",
				d3: "d3",
				crossfilter : "crossfilter",
				dc : "dc",
				datamonkey : "datamonkey",
				_: "lodash",
				jQuery: "jquery"
		}),
 		new webpack.IgnorePlugin(/jsdom$/),
		new ExtractTextPlugin("[name].css")
	],
  resolve: {
		alias: {
			'dc': __dirname + '/node_modules/dc/dc.min.js',
			'dc.css': __dirname + '/node_modules/dc/dc.min.css',
			'bootstrap.css': __dirname + '/node_modules/bootstrap/dist/css/bootstrap.css',
			'bootstrap-theme.css': __dirname + '/node_modules/bootstrap/dist/css/bootstrap-theme.css',
			'phylotree.css': __dirname + '/node_modules/phylotree/phylotree.css'
		}
	},
};

// Hot mode
if (process.env.HOT) {
  config.devtool = 'eval';
  config.entry.bundle.unshift('react-native-webpack-server/hot/entry');
  config.entry.bundle.unshift('webpack/hot/only-dev-server');
  config.entry.bundle.unshift('webpack-dev-server/client?http://localhost:8082');
  config.output.publicPath = 'http://localhost:8082/';
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

  // Note: enabling React Transform and React Transform HMR:

  config.module.loaders[0].query.plugins.push('react-transform');
  config.module.loaders[0].query.extra = {
    'react-transform': [{
      target: 'react-transform-hmr',
      imports: ['react-native'],
      locals: ['module'],
    }],
  };
}

if (process.env.NODE_ENV === 'production') {
  config.devtool = false;
  config.debug = false;
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
