export default class Button extends PIXI.Sprite {
	constructor(label: string) {
		super(PIXI.loader.resources['game_assets'].textures['button']);

		const buttonLabel = new PIXI.extras.BitmapText(label, { font: '36px LibelSuit', tint: 0x000000 });
		buttonLabel.anchor = 0.5;
		this.addChild(buttonLabel);

		this.interactive = true;
	}
}
