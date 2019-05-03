import { Sprite, BitmapText, Point, Container, DisplayObject, Loader } from 'pixi.js';

export default class MineIndicatorView extends Container {
	private readonly count: BitmapText;
	private value: number;

	constructor() {
		super();

		const icon = new Sprite(Loader.shared.resources['game_assets'].textures['bomb']);
		icon.anchor.set(1, 0.5);

		this.count = new BitmapText('', { font: { size: 28, name: 'LibelSuit' }, tint: 0x000000 });
		this.count.anchor = new Point(0, 0.5);
		this.count.x = 10;

		this.addChild(
			icon,
			this.count as DisplayObject,
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
