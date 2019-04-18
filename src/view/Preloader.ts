export class Preloader extends PIXI.utils.EventEmitter {
	public static readonly EVENT_RESOURCED_LOADED: string = 'onResourcedLoaded';

	constructor() {
		super();

		PIXI.loader.baseUrl = 'assets';
		PIXI.loader.add('game_assets', 'img/game_assets.json')
			.load(() => this.emit(Preloader.EVENT_RESOURCED_LOADED));
	}

}
