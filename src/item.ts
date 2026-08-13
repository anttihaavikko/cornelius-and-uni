import { COLORS } from './colors';
import { Game } from './engine/game';
import { Vector } from './engine/vector';
import { Shadowed } from './shadowed';

export class Item extends Shadowed {
    public held: boolean;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 0, 0);
        this.d = this.p.y;
    }

    public drop(pos: Vector): void {
        this.p = pos;
        this.d = this.p.y;
        this.held = false;
        this.shadowShown = true;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rotate(this.rotation);
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.rect(-15, -30, 30, 30);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
