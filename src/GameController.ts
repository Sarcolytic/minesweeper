import 'PIXI';
import { Preloader } from './view/Preloader';
import { MainMenuView } from './view/MainMenuView';
import { GameConstants } from './utils/GameConstatnts';

window.onload = () => {
	new GameController();
};

class GameController {
	private app: PIXI.Application;
	private mainMenu: MainMenuView;

	constructor() {
		const appOptions = {
			backgroundColor: 0x000000,
			view: document.getElementById('game') as HTMLCanvasElement,
		};
		this.app = new PIXI.Application(GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT, appOptions);

		const preloader = new Preloader();
		preloader.once(Preloader.EVENT_RESOURCED_LOADED, this.onGameResourcedLoaded, this);
	}

	private onGameResourcedLoaded(): void {
		console.log('onGameResourcedLoaded');
		this.mainMenu = new MainMenuView();
		this.app.stage.addChild(this.mainMenu);
	}
}
