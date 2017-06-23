var webpack = require('webpack');
var path = require('path');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var ROOT_PATH = helpers.root.path;

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = webpackMerge(commonConfig, {
	debug: true,
	devtool: 'source-map',
	entry: {
		'RNI.browser.dev': helpers.root('dev.js')
	},
	output: {
		path: helpers.root('dist'),
		publicPath: '/',
		filename: '[name].js',
		pathinfo: true,
		chunkFilename: '[id].chunk.js'
	},

	plugins: [
		new webpack.dependencies.LabeledModulesPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'ENV': JSON.stringify(ENV)
			}
		})
	],
	devServer: {
		historyApiFallback: true,
		stats: 'minimal',
		setup: function (app) {
			app.use('/data', function (req, res) {
				res.sendFile(path.join(helpers.root('static'), '/data/' + req.url));
			});
		},
		proxy: [{
		  '/api': {
			target: 'http://www.xui.com/api/',
			secure: false,
			bypass: function(req, res, proxyOptions) {
			  if (req.headers.accept.indexOf('html') !== -1) {
					console.log('Skipping proxy for browser request.');
					return '/index.html';
				}else{
					console.log('bypass proxy'+req.url);
					return '...';
				}
			}
		  }
		}]
	}
});
