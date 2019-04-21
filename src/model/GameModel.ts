import CellModel, { CellPositionInField } from './CellModel';

export default class GameModel extends PIXI.utils.EventEmitter {
	public static readonly EVENT_CELL_OPENED: string = 'onCellOpened';
	public static readonly EVENT_CELL_FLAG_SET: string = 'onCellFlagSet';
	public static readonly EVENT_CELL_FLAG_UNSET: string = 'onCellFlagUnset';
	public static readonly EVENT_UPDATE_GAME_STATUS: string = 'onGameStatusUpdated';

	public static readonly STATUS_WIN: string = 'WIN';
	public static readonly STATUS_LOSE: string = 'LOSE';
	public static readonly STATUS_PLAYING: string = 'PLAYING';

	public static readonly FIELD_SIZE: number = 10;
	public static readonly MINES_COUNT: number = 10;

	private gameStatus: string;
	private openedCellsCount: number;
	private readonly cells: CellModel[][];

	constructor() {
		super();

		this.gameStatus = GameModel.STATUS_PLAYING;
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
		this.gameStatus = GameModel.STATUS_PLAYING;

		this.cells.flat().forEach(cell => cell.reset());
	}

	/**
	 * Open the cell
	 * @param {Cell} cell - Opening cell
	 * @param {Boolean} recursion - True if the function called in recursion
	 * @return {Boolean} - False in case cell is already opened
	 */
	public openCell(x: number, y: number, recursion: boolean): boolean {

		// Start the game
		// TODO check status
		if (this.openedCellsCount === 0) {
			this.digMines(GameModel.MINES_COUNT, x, y);
			this.updateGameStatus(GameModel.STATUS_PLAYING);
		}

		if (this.isCellOpen(x, y) || this.isCellFlagged(x, y)) {
			return false;
		}

		// Change game status in case of mine detonating
		if (this.isCellMined(x, y)) {
			if (!recursion) {
				this.lose();
				return false;
			}
			return false;
		}

		// Counting quantity of surrounding mines
		const surroundingMines = this.countSurroundingMines(x, y);
		this.cells[x][y].setSurroundingMines(surroundingMines);

		// Add cell to openCells
		this.cells[x][y].setOpened();
		this.openedCellsCount++;

		// Dispatching new eventDispatcher
		this.emit(GameModel.EVENT_CELL_OPENED, x, y);

		// Check for winning
		if (this.isWin()) {
			return;
		}

		if (surroundingMines === 0) {
			// Gather cell's neighbors and launch recursion
			const neighbors = this.getNeighbors(x, y);

			for (let i = 0; i < neighbors.length; i++) {
				this.openCell(neighbors[i].x, neighbors[i].y, true);
			}
		}

		return true;
	}

	public getField(): CellModel[][] {
		return this.cells;
	}

	public getNotOpenMinePositions(): CellPositionInField[] {
		return this.cells
			.flat()
			.filter(cell => cell.isMined())
			.map(cell => cell.getPosition());
	}

	/**
	 * Creates and digs mines
	 */
	private digMines(mines: number, initX: number, initY: number): void {

		let i = 0;

		do {
			const x = Math.floor(Math.random() * mines);
			const y = Math.floor(Math.random() * mines);
			const cellIsMined = this.isCellMined(x, y);

			if ((x !== initX || y !== initY) && !cellIsMined) {
				this.cells[x][y].setMined();
				i += 1;
			}

		} while (i < mines);
	}

	/**
	 * How many mines around cell
	 */
	private countSurroundingMines(x: number, y: number): number {

		// Get neighbors cells
		const neighborsCells = this.getNeighbors(x, y);
		let mines = 0;

		for (let i = 0; i < neighborsCells.length; i++) {
			if (this.isCellMined(neighborsCells[i].x, neighborsCells[i].y)) {
				mines++;
			}
		}

		return mines;
	}

	/**
	 * Get neighbors of the cell
	 * @param {Cell} cell - Coordinates of a cell
	 * @param {Boolean} cross - Select vertical & horizontal cells only (except corner's cell)
	 * @return {Cell} cells - Neighbors of the cell
	 */
	private getNeighbors (initX: number, initY: number): any[] {

		const cells = [];

		// Coordinates of first neighbor
		let firstNeighborX = initX - 1;
		let firstNeighborY = initY - 1;

		// Quantity of cells from top left cell
		let endX = 3;
		let endY = 3;

		// Limit coordinates by left and top field's borders
		if (firstNeighborX === -1) {
			firstNeighborX = 0;
			endX = 2;
		}
		if (firstNeighborY === -1) {
			firstNeighborY = 0;
			endY = 2;
		}

		// Limit quantity of cells by right and bottom field's borders
		if (firstNeighborX === 8) {
			endX = 2;
		}
		if (firstNeighborY === 8) {
			endY = 2;
		}

		// Generate neighbor cells
		for (let i = 0; i < endX; i++) {
			for (let j = 0; j < endY; j++) {
				cells.push({ x: firstNeighborX + i, y: firstNeighborY + j });
			}
		}

		// Excluding cell itself from cell's neighbor
		for (let i = 0; i < cells.length; i++) {
			if (cells[i].x === initX && cells[i].y === initY) {
				cells.splice(i, 1);
				break;
			}
		}

		return cells;
	}

	public switchFlag(x: number, y: number): void {
		if (this.isCellFlagged(x, y)) {
			this.unsetFlag(x, y);
		} else {
			this.setFlag(x, y);
		}
	}

	private setFlag(x: number, y: number): void {
		this.cells[x][y].setFlag(true);

		this.emit(GameModel.EVENT_CELL_FLAG_SET, { row: x, column: y });
	}

	private unsetFlag(x: number, y: number): void {
		this.cells[x][y].setFlag(false);

		this.emit(GameModel.EVENT_CELL_FLAG_UNSET, { row: x, column: y });
	}

	private isCellOpen(x: number, y: number): boolean {
		return this.cells[x][y].isOpened();
	}

	private isCellMined(x: number, y: number): boolean {
		return this.cells[x][y].isMined();
	}

	private isCellFlagged(x: number, y: number): boolean {
		return this.cells[x][y].isFlagged();
	}

	/**
	 * Lose the game
	 */
	private lose(): void {
		this.updateGameStatus(GameModel.STATUS_LOSE);
	}

	/**
	 * Is player win?
	 * @returns {boolean} Returns true in case of winning
	 */
	private isWin(): boolean {
		if (this.openedCellsCount === GameModel.FIELD_SIZE ** 2 - GameModel.MINES_COUNT) {
			this.updateGameStatus(GameModel.STATUS_WIN);
			return true;

		}
		return false;
	}

	private updateGameStatus(newStatus: string): void {
		this.gameStatus = newStatus;
		this.emit(GameModel.EVENT_UPDATE_GAME_STATUS, newStatus);
	}
}
