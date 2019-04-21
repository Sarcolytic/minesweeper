import { GameConstants } from '../utils/GameConstatnts';

export default class PauseMenuView extends PIXI.Container {
	public static readonly EVENT_CONTINUE_BUTTON_CLICK: string = 'onContinueButtonClick';
	public static readonly EVENT_MAIN_MENU_BUTTON_CLICK: string = 'onNewGameButtonClick';

	constructor() {
		super();

		const gameAssets = PIXI.loader.resources['game_assets'].textures;

		const continueButton = new PIXI.Sprite(gameAssets['button']);
		continueButton.interactive = true;
		continueButton.on('pointertap', () => { this.emit(PauseMenuView.EVENT_CONTINUE_BUTTON_CLICK); });
		continueButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y - 100);

		const continueLabel = new PIXI.extras.BitmapText('CONTINUE', { font: '36px LibelSuit', tint: 0x000000 });
		continueLabel.anchor = 0.5;
		continueButton.addChild(continueLabel);

		const mainMenuButton = new PIXI.Sprite(gameAssets['button']);
		mainMenuButton.interactive = true;
		mainMenuButton.on('pointertap', () => { this.emit(PauseMenuView.EVENT_MAIN_MENU_BUTTON_CLICK); });
		mainMenuButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y + 100);

		const newGameLabel = new PIXI.extras.BitmapText('NEW GAME', { font: '36px LibelSuit', tint: 0x000000 });
		newGameLabel.anchor = 0.5;
		mainMenuButton.addChild(newGameLabel);

		this.addChild(
			continueButton,
			mainMenuButton,
		);
	}
}
