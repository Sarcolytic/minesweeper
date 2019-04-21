export default class MineIndicatorView extends PIXI.Container {
	private readonly count: PIXI.extras.BitmapText;
	private value: number;

	constructor() {
		super();

		const icon = new PIXI.Sprite(PIXI.loader.resources['game_assets'].textures['bomb']);
		icon.anchor.set(1, 0.5);

		this.count = new PIXI.extras.BitmapText('', { font: '28px LibelSuit', tint: 0x000000 });
		this.count.anchor = new PIXI.Point(0, 0.5);
		this.count.x = 10;

		this.addChild(
			icon,
			this.count as PIXI.DisplayObject,
		);
	}

	public setCount(newValue: number): void {
		if (this.value === newValue) {
			return;
		}

		this.value = newValue;
		this.count.text = newValue.toString();
	}

	public increase(): void {
		this.setCount(this.value + 1);
	}

	public decrease(): void {
		this.setCount(this.value - 1);
	}
}
