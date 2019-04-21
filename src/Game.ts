import 'PIXI';
import Preloader from './controller/Preloader';
import MainMenuView from './view/MainMenuView';
import { GameConstants, GameScenes } from './utils/GameConstants';
import GameModel from './model/GameModel';
import GameView from './view/GameView';
import GameController from './controller/GameController';
import GameScenesController from './controller/GameScenesController';
import PauseMenuView from './view/PauseMenuView';

window.onload = () => {
	new Game();
};

class Game {
	private app: PIXI.Application;
	private scenesController: GameScenesController;
	private gameController: GameController;

	constructor() {
		const appOptions = {
			backgroundColor: 0x000000,
			view: document.getElementById('game') as HTMLCanvasElement,
		};
		this.app = new PIXI.Application(GameConstants.GAME_WIDTH, GameConstants.GAME_HEIGHT, appOptions);
		this.app.view.addEventListener('contextmenu', event => event.preventDefault());

		this.scenesController = new GameScenesController(this.app.stage);

		const preloader = new Preloader();
		preloader.once(Preloader.EVENT_RESOURCED_LOADED, this.onGameResourcedLoaded, this);
	}

	private onGameResourcedLoaded(): void {
		const gameBg = new PIXI.extras.TilingSprite(
			PIXI.loader.resources['game_assets'].textures['game_bg'],
			GameConstants.GAME_WIDTH,
			GameConstants.GAME_HEIGHT,
		);
		this.app.stage.addChild(gameBg);

		this.initGame();
	}

	private initGame(): void {
		const mainMenu = new MainMenuView();
		mainMenu.on(MainMenuView.EVENT_BUTTON_CLICK, this.startGame, this);
		this.scenesController.addScene(GameScenes.MAIN_MENU, mainMenu, true);

		const gameModel = new GameModel();
		const gameView = new GameView(gameModel);
		gameView.on(GameView.EVENT_PAUSE_BUTTON_CLICK, () => { this.scenesController.show(GameScenes.PAUSE_MENU); });
		this.gameController = new GameController(gameModel, gameView);
		this.scenesController.addScene(GameScenes.GAME, gameView);

		const pauseMenu = new PauseMenuView();
		this.scenesController.addScene(GameScenes.PAUSE_MENU, pauseMenu);
		pauseMenu.on(PauseMenuView.EVENT_CONTINUE_BUTTON_CLICK, () => { this.scenesController.show(GameScenes.GAME); });
		pauseMenu.on(PauseMenuView.EVENT_MAIN_MENU_BUTTON_CLICK, () => { this.scenesController.show(GameScenes.MAIN_MENU); });
	}

	private startGame(): void {
		this.gameController.resetGame();
		this.scenesController.show(GameScenes.GAME);
	}
}
