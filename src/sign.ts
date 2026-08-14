import { COLORS } from './colors';
import { Dude } from './dude';
import { Game } from './engine/game';
import { Item } from './item';

export class Sign extends Item {
    public locked: boolean = true;
    public shadowWidth: number = 18;

    constructor(game: Game, x: number, y: number, public contents: string) {
        super(game, x, y, 1);
    }

    public act(dude: Dude): void {
        // dude.hop(dude.p);
        dude.talk(this.contents);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.fillStyle = COLORS.brown;
        ctx.lineWidth = 2;
        ctx.translate(this.p.x, this.p.y);
        ctx.rect(-3, -35, 6, 35);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(-15, -30, 30, 20);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
