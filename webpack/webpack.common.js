var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


var helpers = require('./helpers');
var ROOT_PATH = helpers.root.path;
var path = require('path');

var node_modules_path = helpers.root('node_modules');

var src_dir = 'src';

var src_path = helpers.root(src_dir);

module.exports = {
	entry: {
	},
	resolve: {
		root: [ROOT_PATH],
		modulesDirectories: ['node_modules', node_modules_path],
		extensions: ['', '.js', '.js'],
	},
	output: {
		libraryTarget: 'var'
	},
	module: {
		loaders: [{
			test: /\.html$/,
			loader: 'html'
		}, {
			test: /\.(js|jsx)$/,
			exclude: /(node_modules)/,
			loader: 'babel',
			query: {
				plugins: ['lodash'],
			}
		}]
	},
	plugins: [
		new LodashModuleReplacementPlugin()
	]
};
