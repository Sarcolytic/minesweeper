import { Container, BitmapText, DisplayObject } from 'pixi.js';
import GameModel from '../model/GameModel';
import CellView from './CellView';
import { GameConstants } from '../utils/GameConstants';
import { CellViewEvents } from './CellViewEvents';
import { CellPositionInField } from '../model/CellPositionInField';
import Button from './components/Button';
import MineIndicatorView from './MineIndicatorView';

export default class GameView extends Container {
	public static readonly EVENT_PAUSE_BUTTON_CLICK: string = 'onPauseButtonClicked';

	private readonly model: GameModel;
	private readonly cells: CellView[][];
	private readonly mineIndicator: MineIndicatorView;
	private readonly gameState: BitmapText;

	constructor(model: GameModel) {
		super();

		this.model = model;
		this.model.on(GameModel.EVENT_UPDATE_GAME_STATE, this.onGameStateUpdated, this);
		this.model.on(GameModel.EVENT_CELL_OPENED, this.onCellOpened, this);
		this.model.on(GameModel.EVENT_CELL_FLAG_SET, this.onCellFlagSet, this);
		this.model.on(GameModel.EVENT_CELL_FLAG_UNSET, this.onCellFlagUnset, this);

		this.cells = [];

		const fieldContainer = new Container();
		fieldContainer.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);
		this.addChild(fieldContainer);

		const field = model.getField();
		for (let i = 0; i < field.length; i++) {
			this.cells[i] = [];

			for (let j = 0; j < field[i].length; j++) {
				const cell = new CellView(field[i][j].getPosition());
				cell.on(
					CellViewEvents.EVENT_LEFT_CLICK,
					(position: CellPositionInField) => this.emit(CellViewEvents.EVENT_LEFT_CLICK, position),
				);
				cell.on(
					CellViewEvents.EVENT_RIGHT_CLICK,
					(position: CellPositionInField) => this.emit(CellViewEvents.EVENT_RIGHT_CLICK, position),
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

		this.gameState = new BitmapText('', { font: { size: 50, name: 'LibelSuit' }, tint: 0x00A517 });
		this.gameState.anchor = 0.5;
		this.gameState.position.set(GameConstants.GAME_CENTER_X, 50);

		this.addChild(
			pauseButton,
			this.mineIndicator as DisplayObject,
			this.gameState,
		);
	}

	public reset(): void {
		this.cells.forEach((cellRow) => {
			cellRow.forEach(cell => cell.reset());
		});

		this.mineIndicator.setCount(GameModel.MINES_COUNT);

		this.gameState.text = '';
	}

	private onGameStateUpdated(state: string): void {
		if (state === GameModel.STATE_LOSE) {
			this.showLose();
		} else if (state === GameModel.STATE_WIN) {
			this.showWin();
		}
	}

	private onCellOpened(position: CellPositionInField, surroundingMines: number): void {
		this.getCell(position).open(surroundingMines);
	}

	private onCellFlagSet(position: CellPositionInField): void {
		this.getCell(position).switchFlag(true);

		this.mineIndicator.decrease();
	}

	private onCellFlagUnset(position: CellPositionInField): void {
		this.getCell(position).switchFlag(false);

		this.mineIndicator.increase();
	}

	private showWin(): void {
		this.gameState.text = 'WIN';
		this.gameState.tint = 0x00A517;
	}

	private showLose(): void {
		this.gameState.text = 'LOSE';
		this.gameState.tint = 0xDC0B0B;

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
