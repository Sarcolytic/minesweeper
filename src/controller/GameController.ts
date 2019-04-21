import GameModel from '../model/GameModel';
import GameView from '../view/GameView';
import { CellViewEvents } from '../view/CellViewEvents';
import { CellPositionInField } from '../model/CellModel';

export default class GameController {
	private readonly model: GameModel;
	private readonly view: GameView;

	constructor(model: GameModel, view: GameView) {
		this.model = model;
		this.view = view;

		this.view.on(CellViewEvents.EVENT_LEFT_CLICK, this.onViewLeftClick, this);
		this.view.on(CellViewEvents.EVENT_RIGHT_CLICK, this.onViewRightClick, this);
	}

	public resetGame(): void {
		this.model.reset();
		this.view.reset();
	}

	private onViewLeftClick(cellPosition: CellPositionInField): void {
		this.model.openCell(cellPosition, false);
	}

	private onViewRightClick(cellPosition: CellPositionInField): void {
		this.model.switchFlag(cellPosition.row, cellPosition.column);
	}
}
