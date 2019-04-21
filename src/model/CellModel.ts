export type CellPositionInField = {
	row: number,
	column: number,
};

export default class CellModel extends PIXI.utils.EventEmitter {
	public static readonly EVENT_OPENED: string = 'onOpened';
	public static readonly EVENT_MINED: string = 'onMined';

	private readonly position: CellPositionInField;

	private surroundingMines: number;
	private mined: boolean;
	private opened: boolean;
	private flagged: boolean;

	constructor(row: number, column: number) {
		super();

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

		this.emit(CellModel.EVENT_MINED);
	}

	public isMined(): boolean {
		return this.mined;
	}

	public setOpened(): void {
		this.opened = true;

		this.emit(CellModel.EVENT_OPENED, this.surroundingMines);
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
