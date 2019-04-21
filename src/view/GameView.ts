import GameModel from '../model/GameModel';
import CellView from './CellView';
import { GameConstants } from '../utils/GameConstants';
import { CellViewEvents } from './CellViewEvents';
import Button from './components/Button';

export default class GameView extends PIXI.Container {
	public static readonly EVENT_PAUSE_BUTTON_CLICK: string = 'onPauseButtonClicked';

	private readonly model: GameModel;
	private readonly cells: CellView[][];

	constructor(model: GameModel) {
		super();

		this.model = model;
		this.model.on(GameModel.EVENT_UPDATE_GAME_STATUS, this.onGameStatusUpdated, this);

		this.cells = [];

		const fieldContainer = new PIXI.Container();
		fieldContainer.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);
		this.addChild(fieldContainer);

		const field = model.getField();
		for (let i = 0; i < field.length; i++) {
			this.cells[i] = [];

			for (let j = 0; j < field[i].length; j++) {
				const cell = new CellView(field[i][j]);
				cell.on(
					CellViewEvents.EVENT_LEFT_CLICK,
					position => this.emit(CellViewEvents.EVENT_LEFT_CLICK, position),
				);
				cell.on(
					CellViewEvents.EVENT_RIGHT_CLICK,
					position => this.emit(CellViewEvents.EVENT_RIGHT_CLICK, position),
				);

				cell.position.set(CellView.CELL_SIZE * i, CellView.CELL_SIZE * j);
				this.cells[i].push(cell);

				fieldContainer.addChild(cell);
			}
		}

		fieldContainer.pivot.set(fieldContainer.width * 0.5, fieldContainer.height * 0.5);

		const pauseButton = new Button('PAUSE');
		pauseButton.on('pointertap', () => { this.emit(GameView.EVENT_PAUSE_BUTTON_CLICK); });
		pauseButton.position.set(800, GameConstants.GAME_CENTER_Y - 100);
		this.addChild(pauseButton);
	}

	public reset(): void {
		this.cells
			.flat()
			.forEach(cell => cell.reset());
	}

	private onGameStatusUpdated(status: string): void {
		if (status === GameModel.STATUS_LOSE) {
			this.showMines();
		}
	}

	private showMines(): void {
		const minePositions = this.model.getNotOpenMinePositions();
		minePositions.forEach(({ row, column }) => {
			this.cells[row][column].showMine();
		});
	}
}
