import { GameConstants } from '../utils/GameConstatnts';

export default class MainMenuView extends PIXI.Container {
	public static readonly EVENT_BUTTON_CLICK: string = 'onButtonClicked';

	constructor() {
		super();

		const gameAssets = PIXI.loader.resources['game_assets'].textures;

		const bg = new PIXI.extras.TilingSprite(
			gameAssets['game_bg'],
			GameConstants.GAME_WIDTH,
			GameConstants.GAME_HEIGHT,
		);

		const playButton = new PIXI.Sprite(gameAssets['button']);
		playButton.interactive = true;
		playButton.on('pointertap', () => { this.emit(MainMenuView.EVENT_BUTTON_CLICK); });
		playButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);

		this.addChild(
			bg,
			playButton,
		);
	}
}
