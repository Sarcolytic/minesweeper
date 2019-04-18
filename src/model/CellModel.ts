export type CellPositionInField = {
	row: number,
	column: number,
};

export default class CellModel extends PIXI.utils.EventEmitter {
	public static readonly EVENT_OPENED: string = 'onOpened';
	public static readonly EVENT_MINED: string = 'onMined';
	public static readonly EVENT_FLAG_SWITCHED: string = 'onFlagSwitched';

	private readonly position: CellPositionInField;

	private surroundingMines: number;
	private mined: boolean;
	private opened: boolean;
	private flagged: boolean;

	constructor(row: number, column: number) {
		super();

		this.position = { row, column };

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

		this.emit(CellModel.EVENT_FLAG_SWITCHED, value);
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
