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
			{ from: path.resolve(__dirname, './assets/css'), to: path.resolve(__dirname, `${outputFolder}/assets/css`) },
			{ from: path.resolve(__dirname, './assets/img/game_assets.json'), to: path.resolve(__dirname, `${outputFolder}/assets/img/game_assets.json`) },
			{ from: path.resolve(__dirname, './assets/img/game_assets.png'), to: path.resolve(__dirname, `${outputFolder}/assets/img/game_assets.png`) }
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
