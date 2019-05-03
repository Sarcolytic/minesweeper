import { utils, Loader } from 'pixi.js';

export default class Preloader extends utils.EventEmitter {
	public static readonly EVENT_RESOURCED_LOADED: string = 'onResourcedLoaded';

	constructor() {
		super();

		Loader.shared.baseUrl = 'assets';
		Loader.shared.add('game_assets', 'img/game_assets.json')
			.add('LibelSuit', 'fonts/LibelSuit.xml')
			.load(() => this.emit(Preloader.EVENT_RESOURCED_LOADED));
	}

}
