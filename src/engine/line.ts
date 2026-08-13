import { Game } from './game';
import { Particle } from './particle';
import { Vector, ZERO, offset } from './vector';

export class LineParticle extends Particle {
    private hDir: number;
    private vDir: number;
    private half: number;

    constructor(game: Game, private from: Vector, private to: Vector, life: number, private width: number, private color: string, private midOffset: number = 0) {
        super(game, 0, 0, 0, 0, life, ZERO);
        this.hDir = Math.random() < 0.5 ? 1 : -1;
        this.vDir = Math.random() < 0.5 ? 1 : -1;
        this.half = 0.25 + Math.random() * 0.5;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        if (this.ratio < 0.2) return;
        ctx.lineWidth = this.width * this.ratio;
        ctx.lineCap = 'butt';
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.from.x, this.from.y);
        if (this.midOffset) {
            const mid:Vector = {
                x: this.from.x * this.half + this.to.x * (1 - this.half),
                y: this.from.y * this.half + this.to.y * (1 - this.half)
            };
            const m1 = offset(mid, this.midOffset * this.hDir, this.midOffset * this.vDir);
            const m2 = offset(mid, -this.midOffset * this.hDir, this.midOffset * this.vDir);
            ctx.lineTo(m1.x, m1.y);
            ctx.lineTo(m2.x, m2.y);
        }
        ctx.lineTo(this.to.x, this.to.y);
        ctx.stroke();
    }
}