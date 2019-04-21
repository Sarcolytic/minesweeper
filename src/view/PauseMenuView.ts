import { GameConstants } from '../utils/GameConstatnts';
import Button from './components/Button';

export default class PauseMenuView extends PIXI.Container {
	public static readonly EVENT_CONTINUE_BUTTON_CLICK: string = 'onContinueButtonClick';
	public static readonly EVENT_MAIN_MENU_BUTTON_CLICK: string = 'onNewGameButtonClick';

	constructor() {
		super();

		const continueButton = new Button('CONTINUE');
		continueButton.on('pointertap', () => { this.emit(PauseMenuView.EVENT_CONTINUE_BUTTON_CLICK); });
		continueButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y - 100);

		const mainMenuButton = new Button('MAIN MENU');
		mainMenuButton.on('pointertap', () => { this.emit(PauseMenuView.EVENT_MAIN_MENU_BUTTON_CLICK); });
		mainMenuButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y + 100);

		this.addChild(
			continueButton,
			mainMenuButton,
		);
	}
}
