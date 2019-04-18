import GameModel from '../model/GameModel';
import CellView from './CellView';
import { GameConstants } from '../utils/GameConstatnts';
import { CellViewEvents } from './CellViewEvents';

export default class GameView extends PIXI.Container {

	private readonly model: GameModel;

	constructor(model: GameModel) {
		super();

		this.model = model;

		const fieldContainer = new PIXI.Container();
		fieldContainer.position.set(GameConstants.GAME_CENTER_X, GameConstants.GAME_CENTER_Y);
		this.addChild(fieldContainer);

		const field = model.getField();
		for (let i = 0; i < field.length; i++) {
			for (let j = 0; j < field[i].length; j++) {
				const cell = new CellView(field[i][j]);
				cell.on(
					CellViewEvents.EVENT_LEFT_CLICK,
					position => this.emit(CellViewEvents.EVENT_LEFT_CLICK, position),
				);
				cell.on(
					CellViewEvents.EVENT_RIGHT_CLICK,
					position => this.emit(CellViewEvents.EVENT_RIGHT_CLICK, position),
				);

				cell.position.set(32 * i, 32 * j);
				fieldContainer.addChild(cell);
			}
		}

		fieldContainer.pivot.set(fieldContainer.width * 0.5, fieldContainer.height * 0.5);
	}
}
