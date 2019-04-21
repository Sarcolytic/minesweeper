import { GameConstants } from '../utils/GameConstants';
import Button from './components/Button';

export default class MainMenuView extends PIXI.Container {
	public static readonly EVENT_BUTTON_CLICK: string = 'onButtonClicked';

	constructor() {
		super();

		const playButton = new Button('PLAY');
		playButton.on('click', () => { this.emit(MainMenuView.EVENT_BUTTON_CLICK); });
		playButton.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);
		this.addChild(playButton);
	}
}
