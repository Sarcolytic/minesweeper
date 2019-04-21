export default class GameScenesController {

	private readonly stage: PIXI.Container;
	private readonly scenes: Map<string, PIXI.Container>;
	private currentSceneId: string;

	constructor(stage: PIXI.Container) {
		this.stage = stage;

		this.scenes = new Map();
	}

	public addScene(id: string, scene: PIXI.Container, show: boolean = false): void {
		this.scenes.set(id, scene);

		scene.visible = false;
		this.stage.addChild(scene);

		if (show) {
			this.show(id);
		}
	}

	public show(id: string): void {
		if (this.currentSceneId === id) {
			return;
		}

		if (!this.scenes.has(id)) {
			throw new Error(`Undefined scene: ${id}`);
		}

		if (this.currentSceneId) {
			this.scenes.get(this.currentSceneId).visible = false;
		}

		this.scenes.get(id).visible = true;
		this.currentSceneId = id;
	}
}
