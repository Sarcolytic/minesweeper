const merge = require('webpack-merge');
const path = require('path');
const webpackClean = require('clean-webpack-plugin');
const webpackCopyPlugin = require('copy-webpack-plugin');
const webpackHtmlPlugin = require('html-webpack-plugin');
const webpackHtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const webpack = require('webpack');

const common = require('./webpack.common');
const outputFolder = 'dist';

const version = Date.now();

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, `${outputFolder}/src`),
		filename: '[name].[hash].bundle.js'
	},
	performance: { hints: false },
	plugins: [
		new webpack.IgnorePlugin(/validator/),
		new webpackClean([outputFolder]),
		new webpack.DefinePlugin({
			MODE_DEBUG: JSON.stringify(false),
			VERSION: JSON.stringify(version)
		}),
		new webpackCopyPlugin([
			{ from: path.resolve(__dirname, './WebContent/assets/animations'), to: path.resolve(__dirname, `${outputFolder}/assets/animations`) },
			{ from: path.resolve(__dirname, './WebContent/assets/atlas'), to: path.resolve(__dirname, `${outputFolder}/assets/atlas`) },
			{ from: path.resolve(__dirname, './WebContent/assets/sound'), to: path.resolve(__dirname, `${outputFolder}/assets/sound`) },
			{ from: path.resolve(__dirname, './WebContent/assets/css'), to: path.resolve(__dirname, `${outputFolder}/assets/css`) },
			{ from: path.resolve(__dirname, './WebContent/assets/fonts'), to: path.resolve(__dirname, `${outputFolder}/assets/fonts`) },
			{ from: path.resolve(__dirname, './WebContent/assets/video'), to: path.resolve(__dirname, `${outputFolder}/assets/video`) },
			{ from: path.resolve(__dirname, './WebContent/assets/images/preloader'), to: path.resolve(__dirname, `${outputFolder}/assets/images/preloader`) },
			{ from: path.resolve(__dirname, './WebContent/assets/images/level_bg/miami_blur_bg'), to: path.resolve(__dirname, `${outputFolder}/assets/images/level_bg/miami_blur_bg`) },
			{ from: path.resolve(__dirname, './WebContent/assets/images/level_bg/canada_blur_bg'), to: path.resolve(__dirname, `${outputFolder}/assets/images/level_bg/canada_blur_bg`) },
			{ from: path.resolve(__dirname, './WebContent/assets/images/farewellParty/window/GoToPartyWindow_2.jpg'), to: path.resolve(__dirname, `${outputFolder}/assets/images/farewellParty/window/GoToPartyWindow_2.jpg`) },
		]),
		new ImageminPlugin({
			test: /\.(jpe?g|png)$/i,
			plugins: [
				imageminMozjpeg({
					quality: 90
				})
			]
		}),
		new webpackHtmlPlugin({
			template: path.resolve(__dirname, './WebContent/template.html'),
			filename: '../index.html',
			title: 'Hollywood Clicker'
		}),
		new webpackHtmlIncludeAssetsPlugin({
			assets: [ `assets/css/main.css?v=${version}` ],
			append: false,
			publicPath: ''
		})
	]
});
