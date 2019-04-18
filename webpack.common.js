const path = require('path');

module.exports = {
	entry: {
		app: [path.resolve(__dirname, 'src/GameController.ts')],
		vendor: ['PIXI']
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
					enforce: true
				}
			}
		}
	},
	resolve: {
			extensions: ['.ts', '.js'], // .ts for src, .js for webpack-dev-server dependencies
			alias: {
				'PIXI': path.resolve(__dirname, 'node_modules/pixi.js/dist/pixi.js'),
			}
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				include: [
					path.resolve(__dirname, './src/'),
				],
				loader: 'babel-loader'
			}
		]
	},
};
