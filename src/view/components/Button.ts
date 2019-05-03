import { Sprite, BitmapText, Loader } from 'pixi.js';

export default class Button extends Sprite {
	constructor(label: string) {
		super(Loader.shared.resources['game_assets'].textures['button']);

		const buttonLabel = new BitmapText(label, { font: { size: 36, name: 'LibelSuit' }, tint: 0x000000 });
		buttonLabel.anchor = 0.5;
		this.addChild(buttonLabel);

		this.interactive = true;
	}
}
