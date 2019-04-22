import { CellViewEvents } from './CellViewEvents';
import { CellPositionInField } from '../model/CellPositionInField';

export default class CellView extends PIXI.Container {
	public static readonly CELL_SIZE: number = 32;

	private readonly positionInField: CellPositionInField;
	private readonly assets: PIXI.loaders.TextureDictionary;
	private readonly background: PIXI.Sprite;
	private readonly flagIcon: PIXI.Sprite;
	private readonly statusIcon: PIXI.Sprite;

	constructor(position: CellPositionInField) {
		super();

		this.positionInField = position;

		this.assets = PIXI.loader.resources['game_assets'].textures;

		this.background = new PIXI.Sprite(this.assets['cell_close']);

		this.flagIcon = new PIXI.Sprite(this.assets['flag']);
		this.flagIcon.visible = false;

		this.statusIcon = new PIXI.Sprite(this.assets['1']);
		this.statusIcon.visible = false;

		this.addChild(
			this.background,
			this.flagIcon,
			this.statusIcon,
		);

		this.interactive = true;
		this.on('click', this.onLeftClicked, this);
		this.on('rightclick', this.onRightClicked, this);
	}

	public reset(): void {
		this.statusIcon.visible = false;
		this.flagIcon.visible = false;
		this.background.texture = this.assets['cell_close'];

		this.on('click', this.onLeftClicked, this);
		this.interactive = true;
	}

	public open(surroundingMines: number): void {
		this.background.texture = this.assets['cell_open'];

		if (surroundingMines > 0) {
			this.statusIcon.texture = this.assets[`${surroundingMines}`];
			this.statusIcon.visible = true;
		}

		this.interactive = false;
	}

	public switchFlag(value: boolean): void {
		this.flagIcon.visible = value;

		if (value) {
			this.off('click', this.onLeftClicked, this);
		} else {
			this.on('click', this.onLeftClicked, this);
		}
	}

	public showMine(): void {
		this.flagIcon.visible = false;

		this.statusIcon.texture = this.assets['bomb'];
		this.statusIcon.visible = true;
	}

	private onLeftClicked(): void {
		this.emit(CellViewEvents.EVENT_LEFT_CLICK, this.positionInField);
	}

	private onRightClicked(): void {
		this.emit(CellViewEvents.EVENT_RIGHT_CLICK, this.positionInField);
	}
}
