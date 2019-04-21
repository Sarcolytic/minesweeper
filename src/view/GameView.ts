import GameModel from '../model/GameModel';
import CellView from './CellView';
import { GameConstants } from '../utils/GameConstants';
import { CellViewEvents } from './CellViewEvents';
import Button from './components/Button';
import MineIndicatorView from './MineIndicatorView';
import { CellPositionInField } from '../model/CellModel';

export default class GameView extends PIXI.Container {
	public static readonly EVENT_PAUSE_BUTTON_CLICK: string = 'onPauseButtonClicked';

	private readonly model: GameModel;
	private readonly cells: CellView[][];
	private readonly mineIndicator: MineIndicatorView;
	private readonly gameStatus: PIXI.extras.BitmapText;

	constructor(model: GameModel) {
		super();

		this.model = model;
		this.model.on(GameModel.EVENT_UPDATE_GAME_STATUS, this.onGameStatusUpdated, this);
		this.model.on(GameModel.EVENT_CELL_FLAG_SET, this.onCellFlagSet, this);
		this.model.on(GameModel.EVENT_CELL_FLAG_UNSET, this.onCellFlagUnset, this);

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

		const fieldSizeInPixels = CellView.CELL_SIZE * (GameModel.FIELD_SIZE - 1);
		fieldContainer.position.set(
			GameConstants.GAME_CENTER_X - fieldSizeInPixels * 0.5,
			GameConstants.GAME_CENTER_Y - fieldSizeInPixels * 0.5,
		);

		const pauseButton = new Button('PAUSE');
		pauseButton.on('click', () => { this.emit(GameView.EVENT_PAUSE_BUTTON_CLICK); });
		pauseButton.position.set(800, GameConstants.GAME_CENTER_Y - 100);

		this.mineIndicator = new MineIndicatorView();
		this.mineIndicator.setCount(GameModel.MINES_COUNT);
		this.mineIndicator.position.set(800, GameConstants.GAME_CENTER_Y);

		this.gameStatus = new PIXI.extras.BitmapText('', { font: '50px LibelSuit', tint: 0x00A517 });
		this.gameStatus.anchor = 0.5;
		this.gameStatus.position.set(GameConstants.GAME_CENTER_X, 50);

		this.addChild(
			pauseButton,
			this.mineIndicator as PIXI.DisplayObject,
			this.gameStatus,
		);
	}

	public reset(): void {
		this.cells
			.flat()
			.forEach(cell => cell.reset());

		this.mineIndicator.setCount(GameModel.MINES_COUNT);

		this.gameStatus.text = '';
	}

	private onCellFlagSet(position: CellPositionInField): void {
		this.getCell(position).switchFlag(true);

		this.mineIndicator.decrease();
	}

	private onCellFlagUnset(position: CellPositionInField): void {
		this.getCell(position).switchFlag(false);

		this.mineIndicator.increase();
	}

	private onGameStatusUpdated(status: string): void {
		if (status === GameModel.STATUS_LOSE) {
			this.showLose();
		} else if (status === GameModel.STATUS_WIN) {
			this.showWin();
		}
	}

	private showWin(): void {
		this.gameStatus.text = 'WIN';
		this.gameStatus.tint = 0x00A517;
	}

	private showLose(): void {
		this.gameStatus.text = 'LOSE';
		this.gameStatus.tint = 0xDC0B0B;

		this.showMines();
	}

	private showMines(): void {
		const minePositions = this.model.getNotOpenMinePositions();
		minePositions.forEach(({ row, column }) => {
			this.cells[row][column].showMine();
		});
	}

	private getCell({ row, column }: CellPositionInField): CellView {
		return this.cells[row][column];
	}
}
