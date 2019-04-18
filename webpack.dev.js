const merge = require('webpack-merge');
const path = require('path');
const webpackClean = require('clean-webpack-plugin');
const webpackCaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpackForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

const common = require('./webpack.common');
const outputFolder = 'build';

module.exports = merge(common, {
	mode: 'development',
	output: {
		path: path.resolve(__dirname, outputFolder),
		filename: '[name].bundle.js'
	},
	plugins: [
		new webpackCaseSensitivePathsPlugin(),
		new webpackForkTsCheckerPlugin(),
		new webpackClean([outputFolder]),
	],
	devtool: 'inline-source-map',
	devServer: {
		compress: true,
		port: 8080,
		contentBase: [
			path.resolve(__dirname, './'),
		],
		watchOptions: {
			aggregateTimeout: 500,
			ignored: /node_modules/,
			inline: true,
			poll: false
		}
	}
});
