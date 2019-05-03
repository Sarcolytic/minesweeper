import { utils } from 'pixi.js';
import CellModel from './CellModel';
import { CellPositionInField } from './CellPositionInField';

export default class GameModel extends utils.EventEmitter {
	public static readonly EVENT_CELL_OPENED: string = 'onCellOpened';
	public static readonly EVENT_CELL_FLAG_SET: string = 'onCellFlagSet';
	public static readonly EVENT_CELL_FLAG_UNSET: string = 'onCellFlagUnset';
	public static readonly EVENT_UPDATE_GAME_STATE: string = 'onGameStateUpdated';

	public static readonly STATE_INIT: string = 'INITIAL';
	public static readonly STATE_PLAYING: string = 'PLAYING';
	public static readonly STATE_WIN: string = 'WIN';
	public static readonly STATE_LOSE: string = 'LOSE';

	public static readonly FIELD_SIZE: number = 10;
	public static readonly MINES_COUNT: number = 10;

	private gameState: string;
	private openedCellsCount: number;
	private readonly cells: CellModel[][];

	constructor() {
		super();

		this.gameState = GameModel.STATE_INIT;
		this.openedCellsCount = 0;

		this.cells = [];
		for (let i = 0; i < GameModel.FIELD_SIZE; i++) {
			this.cells[i] = [];
			for (let j = 0; j < GameModel.FIELD_SIZE; j++) {
				this.cells[i][j] = new CellModel(i, j);
			}
		}
	}

	public reset(): void {
		this.openedCellsCount = 0;
		this.gameState = GameModel.STATE_INIT;

		this.cells.forEach((cellRow) => {
			cellRow.forEach(cell => cell.reset());
		});
	}

	public getField(): CellModel[][] {
		return this.cells;
	}

	/**
	 * Open the cell
	 * @param {CellPositionInField} position - Opening cell position
	 * @param {Boolean} recursion - True if the function called in recursion
	 * @return {Boolean} - False in case cell is already opened
	 */
	public openCell(position: CellPositionInField, recursion: boolean): void {

		// Start the game
		if (this.gameState === GameModel.STATE_INIT) {
			this.digMines(GameModel.MINES_COUNT, position);
			this.updateGameState(GameModel.STATE_PLAYING);
		}

		const cell = this.getCell(position);

		if (cell.isOpened() || cell.isFlagged()) {
			return;
		}

		// Change game state in case of mine detonating
		if (cell.isMined()) {
			if (!recursion) {
				this.lose();
				return;
			}
			return;
		}

		// Counting quantity of surrounding mines
		const surroundingMines = this.countSurroundingMines(position);
		cell.setSurroundingMines(surroundingMines);

		// Add cell to openCells
		cell.setOpened();
		this.openedCellsCount++;
		this.emit(GameModel.EVENT_CELL_OPENED, position, surroundingMines);

		// Check for winning
		if (this.isWin()) {
			return;
		}

		if (surroundingMines === 0) {
			// Gather cell's neighbors and launch recursion
			const neighbors = this.getNeighbors(position);

			for (let i = 0; i < neighbors.length; i++) {
				this.openCell(neighbors[i].getPosition(), true);
			}
		}
	}

	public switchFlag(position: CellPositionInField): void {
		const cell = this.getCell(position);
		if (cell.isFlagged()) {
			cell.setFlag(false);
			this.emit(GameModel.EVENT_CELL_FLAG_UNSET, position);
		} else {
			cell.setFlag(true);
			this.emit(GameModel.EVENT_CELL_FLAG_SET, position);
		}
	}

	public getNotOpenMinePositions(): CellPositionInField[] {
		const minePositions: CellPositionInField[] = [];

		this.cells.forEach((cellRow) => {
			cellRow.forEach((cell) => {
				if (cell.isMined()) {
					minePositions.push(cell.getPosition());
				}
			});
		});
		return minePositions;
	}

	/**
	 * Creates and digs mines
	 */
	private digMines(mines: number, initPosition: CellPositionInField): void {
		let i = 0;
		do {
			const row = Math.floor(Math.random() * mines);
			const column = Math.floor(Math.random() * mines);
			const cell = this.getCell({ row, column });

			if ((row !== initPosition.row || column !== initPosition.column) && !cell.isMined()) {
				cell.setMined();
				i += 1;
			}

		} while (i < mines);
	}

	/**
	 * How many mines around cell
	 */
	private countSurroundingMines(position: CellPositionInField): number {
		const neighborsCells = this.getNeighbors(position);
		let mines = 0;

		for (let i = 0; i < neighborsCells.length; i++) {
			if (neighborsCells[i].isMined()) {
				mines++;
			}
		}

		return mines;
	}

	/**
	 * Get neighbors of the cell
	 * @param {number} initRow - Cell row in field
	 * @param {number} initColumn - Cell column in field
	 * @return {CellModel} cells - Neighbors of the cell
	 */
	private getNeighbors ({ row: initRow, column: initColumn }: CellPositionInField): CellModel[] {
		const cells = [];

		// Coordinates of first neighbor
		let firstNeighborRow = initRow - 1;
		let firstNeighborColumn = initColumn - 1;

		// Quantity of cells from top left cell
		let endRow = 3;
		let endColumn = 3;

		// Limit coordinates by left and top field's borders
		if (firstNeighborRow === -1) {
			firstNeighborRow = 0;
			endRow = 2;
		}
		if (firstNeighborColumn === -1) {
			firstNeighborColumn = 0;
			endColumn = 2;
		}

		// Limit quantity of cells by right and bottom field's borders
		if (firstNeighborRow === 8) {
			endRow = 2;
		}
		if (firstNeighborColumn === 8) {
			endColumn = 2;
		}

		// Generate neighbor cells
		for (let i = 0; i < endRow; i++) {
			for (let j = 0; j < endColumn; j++) {
				const row = firstNeighborRow + i;
				const column = firstNeighborColumn + j;

				if (row !== initRow || column !== initColumn) { // Excluding cell itself from cell's neighbor
					cells.push(this.getCell({ row, column }));
				}
			}
		}

		return cells;
	}

	private getCell({ row, column }: CellPositionInField): CellModel {
		return this.cells[row][column];
	}

	/**
	 * Lose the game
	 */
	private lose(): void {
		this.updateGameState(GameModel.STATE_LOSE);
	}

	/**
	 * Is player win?
	 */
	private isWin(): boolean {
		if (this.openedCellsCount === GameModel.FIELD_SIZE ** 2 - GameModel.MINES_COUNT) {
			this.updateGameState(GameModel.STATE_WIN);
			return true;

		}
		return false;
	}

	private updateGameState(newState: string): void {
		this.gameState = newState;
		this.emit(GameModel.EVENT_UPDATE_GAME_STATE, newState);
	}
}
