import 'PIXI';
import Preloader from './view/Preloader';
import MainMenuView from './view/MainMenuView';
import { GameConstants } from './utils/GameConstatnts';
import GameModel from './model/GameModel';
import GameView from './view/GameView';
import GameController from './controller/GameController';

window.onload = () => {
	new Game();
};

class Game {
	private app: PIXI.Application;
	private mainMenu: MainMenuView;

	constructor() {
		const appOptions = {
			backgroundColor: 0x000000,
			view: document.getElementById('game') as HTMLCanvasElement,
		};
		this.app = new PIXI.Application(GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT, appOptions);
		this.app.view.addEventListener('contextmenu', event => event.preventDefault());

		const preloader = new Preloader();
		preloader.once(Preloader.EVENT_RESOURCED_LOADED, this.onGameResourcedLoaded, this);
	}

	private onGameResourcedLoaded(): void {
		this.mainMenu = new MainMenuView();
		this.app.stage.addChild(this.mainMenu);

		this.mainMenu.on(MainMenuView.EVENT_BUTTON_CLICK, this.startGame, this);
	}

	private startGame(): void {
		const gameModel = new GameModel();
		const gameView = new GameView(gameModel);
		const gameController = new GameController(gameModel, gameView);

		this.app.stage.addChild(gameView);
	}
}
