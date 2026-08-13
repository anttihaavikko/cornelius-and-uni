import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { random } from './engine/random';
import { TextEntity } from './engine/text';
import { Vector } from './engine/vector';

export class TextPop extends TextEntity {
    constructor(game: Game, text: string, pos: Vector, color: string, size: number = 30) {
        super(game, text, size, pos.x, pos.y, random(0.7, 0.9), { x: 0, y: random(-0.5, -0.7) }, { shadow: 3, scales: true });
        this.options.color = color;
        this.d = 200;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.ratio = Math.sin(this.ratio / 2 * Math.PI);
    }
}