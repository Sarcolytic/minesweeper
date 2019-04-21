import CellModel from '../model/CellModel';
import { CellViewEvents } from './CellViewEvents';

export default class CellView extends PIXI.Container {
	private readonly model: CellModel;
	private readonly assets: PIXI.loaders.TextureDictionary;
	private readonly background: PIXI.Sprite;
	private readonly icon: PIXI.Sprite;

	constructor(model: CellModel) {
		super();

		this.model = model;
		this.model.on(CellModel.EVENT_OPENED, this.onCellOpened, this);
		this.model.on(CellModel.EVENT_MINED, this.onCellMined, this);
		this.model.on(CellModel.EVENT_FLAG_SWITCHED, this.onToggleFlag, this);

		this.assets = PIXI.loader.resources['game_assets'].textures;

		this.background = new PIXI.Sprite(this.assets['cell_close']);
		this.icon = new PIXI.Sprite();

		this.addChild(
			this.background,
			this.icon,
		);

		this.interactive = true;
		this.on('click', this.onLeftClicked, this);
		this.on('rightclick', this.onRightClicked, this);
	}

	public reset(): void {
		this.icon.texture = PIXI.Texture.EMPTY;

		this.background.texture = this.assets['cell_close'];

		this.interactive = true;
	}

	public showMine(): void {
		this.icon.texture = this.assets['bomb'];
	}

	private onLeftClicked(): void {
		this.emit(CellViewEvents.EVENT_LEFT_CLICK, this.model.getPosition());
	}

	private onRightClicked(): void {
		this.emit(CellViewEvents.EVENT_RIGHT_CLICK, this.model.getPosition());
	}

	private onCellOpened(surroundingMines: number): void {
		this.background.texture = this.assets['cell_open'];

		if (surroundingMines > 0) {
			this.icon.texture = this.assets[`${surroundingMines}`];
		}

		this.interactive = false;
	}

	private onToggleFlag(value: boolean): void {
		this.icon.texture = this.assets['flag'];

		if (value) {
			this.off('click', this.onLeftClicked, this);
		} else {
			this.on('click', this.onLeftClicked, this);
		}
	}

	private onCellMined(): void {
		// this.addChild(new PIXI.Sprite(this.assets['bomb']));
	}
}
