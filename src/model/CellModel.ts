export default class CellModel {
	private readonly row: number;
	private readonly column: number;

	private surroundingMines: number;
	private mined: boolean;
	private opened: boolean;
	private flagged: boolean;

	constructor(row: number, column: number) {
		this.row = row;
		this.column = column;

		this.surroundingMines = 0;
		this.mined = false;
		this.opened = false;
		this.flagged = false;
	}

	public getPosition(): { row: number, column: number } {
		return { row: this.row, column: this.column };
	}

	public setMined(): void {
		this.mined = true;
	}

	public isMined(): boolean {
		return this.mined;
	}

	public setOpened(): void {
		this.opened = true;
	}

	public isOpened(): boolean {
		return this.opened;
	}

	public setFlag(value: boolean): void {
		this.flagged = value;
	}

	public isFlagged(): boolean {
		return this.flagged;
	}

	public setSurroundingMines(value: number): void {
		this.surroundingMines = value;
	}

	public getSurroundingMines(): number {
		return this.surroundingMines;
	}
}
