import { COLORS } from './colors';
import { Entity } from './engine/entity';
import { Game } from './engine/game';

export class Raft extends Entity {
    private moving = false;

    constructor(game: Game, x: number, y: number, private dx: number, private dy: number) {
        super(game, x, y, 60, 60);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        const w = (this.s.x + 20) / 5;
        for (let i = 0; i < 5; i++) {
            ctx.rect(-10 + i * w, -10, w, this.s.y + 20);
        }
        ctx.fillStyle = COLORS.brown;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    public move(entities: Entity[]): void {
        if (!this.moving) return;
        const dirx = this.dx * this.delta * -0.15;
        const diry = this.dy * this.delta * -0.15;
        this.p.x += dirx;
        this.p.y += diry;
        for (const e of entities) {
            if (this.isInside(e.p)) {
                e.p.x += dirx;
                e.p.y += diry;
            }
        }
    }

    public start(): void {
        // this.moving = false;
        setTimeout(() => this.toggle(), 1000);
    }

    private toggle(): void {
        this.moving = !this.moving;
        if (!this.moving) {
            this.dx *= -1;
            this.dy *= -1;
        }
        setTimeout(() => this.toggle(), 1000);
    }
}
