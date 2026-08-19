import { Entity } from './engine/entity';
import { Game } from './engine/game';
import { clamp01 } from './engine/math';
import { lerp, offset, Vector } from './engine/vector';

const SPEED = 0.0008;

export class Raft extends Entity {
    private moving = false;
    private origin: Vector;
    private time = -Math.PI * 0.25 * 1 / SPEED;

    constructor(game: Game, x: number, y: number, private dx: number, private dy: number) {
        super(game, x, y, 60, 60);
        this.origin = this.p;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        const w = (this.s.x + 20) / 5;
        for (let i = 0; i < 5; i++) {
            ctx.rect(-10 + i * w, -10, w, this.s.y + 20);
        }
        ctx.fillStyle = '#E9A186';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.fill();
        ctx.stroke();

        // ctx.fillStyle = '#fff';
        // ctx.font = '30px Arial';
        // ctx.fillText(clamp01(1.5 * Math.sin(this.time * 0.0005) + 0.5).toString(), 0, 0);

        ctx.restore();
    }

    public move(entities: Entity[]): void {
        if (!this.moving) return;
        const next = lerp(this.origin, offset(this.origin, -this.dx * 150, -this.dy * 150), clamp01(1.25 * Math.sin(this.time * SPEED) + 0.5));
        this.time += this.delta;
        const dirx = next.x - this.p.x;
        const diry = next.y - this.p.y;
        this.p = next;
        for (const e of entities) {
            if (this.isInside(e.p)) {
                e.p.x += dirx;
                e.p.y += diry;
            }
        }
    }

    public start(): void {
        this.moving = true;
    }
}
