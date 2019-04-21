import { GameConstants } from '../utils/GameConstatnts';

export default class MainMenuView extends PIXI.Container {
	public static readonly EVENT_BUTTON_CLICK: string = 'onButtonClicked';

	constructor() {
		super();

		const gameAssets = PIXI.loader.resources['game_assets'].textures;

		const playButton = new PIXI.Sprite(gameAssets['button']);
		playButton.interactive = true;
		playButton.on('pointertap', () => { this.emit(MainMenuView.EVENT_BUTTON_CLICK); });
		playButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);

		const label = new PIXI.extras.BitmapText('PLAY', { font: '36px LibelSuit', tint: 0x000000 });
		label.anchor = 0.5;
		label.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);

		this.addChild(
			playButton,
			label as PIXI.DisplayObject,
		);
	}
}
