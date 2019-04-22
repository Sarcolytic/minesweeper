const merge = require('webpack-merge');
const path = require('path');
const webpackClean = require('clean-webpack-plugin');
const webpackCopyPlugin = require('copy-webpack-plugin');
const webpackHtmlPlugin = require('html-webpack-plugin');
const webpackHtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const common = require('./webpack.common');
const outputFolder = 'dist';

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, `${outputFolder}/src`),
		filename: '[name].[hash].bundle.js'
	},
	performance: { hints: false },
	plugins: [
		new webpackClean([outputFolder]),
		new webpackCopyPlugin([
			{ from: path.resolve(__dirname, './assets'), to: path.resolve(__dirname, `${outputFolder}/assets`) },
		]),
		new webpackHtmlPlugin({
			template: path.resolve(__dirname, './template.html'),
			filename: '../index.html',
			title: 'Minesweeper'
		}),
		new webpackHtmlIncludeAssetsPlugin({
			assets: [ `assets/css/main.css` ],
			append: false,
			publicPath: ''
		})
	]
});
