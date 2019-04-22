import { CellPositionInField } from './CellPositionInField';

export default class CellModel {
	private readonly position: CellPositionInField;

	private surroundingMines: number;
	private mined: boolean;
	private opened: boolean;
	private flagged: boolean;

	constructor(row: number, column: number) {
		this.position = { row, column };

		this.reset();
	}

	public reset(): void {
		this.surroundingMines = 0;
		this.mined = false;
		this.opened = false;
		this.flagged = false;
	}

	public getPosition(): CellPositionInField {
		return this.position;
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
}
