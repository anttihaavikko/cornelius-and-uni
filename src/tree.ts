import { COLORS } from './colors';
import { Game } from './engine/game';
import { Shadowed } from './shadowed';

export class Tree extends Shadowed {
    public shadowWidth: number = 50;

    // public constructor(protected game: Game, x: number, y: number, width: number, height: number) {
    //     super(game, x, y, width, height);
    // }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.d = this.p.y;

        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rotate(this.animationPhase * 0.01);
        ctx.rect(-5, -30, 10, 30);
        ctx.fillStyle = COLORS.purple;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
        ctx.translate(0, 20);
        ctx.fillStyle = COLORS.shadow;

        for (let i = 0; i < 3; i++) {
            const size = 1 - 0.1 * i;
            ctx.beginPath();
            ctx.translate(0, -this.s.y * 0.5);
            ctx.rotate(this.animationPhase * 0.01);
            ctx.moveTo(-this.s.x * size, 0);
            ctx.lineTo(this.s.x * size, 0);
            ctx.lineTo(0, -this.s.y * size);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }
}
