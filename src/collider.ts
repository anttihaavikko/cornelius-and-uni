import { COLORS } from './colors';
import { Entity } from './engine/entity';

export class Collider extends Entity {
    public door: boolean;
    public opened: boolean;

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.door || this.opened) return;
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rect(0, 0, this.s.x, this.s.y);
        // ctx.lineWidth = 5;
        // ctx.strokeStyle = 'red';
        // ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.s.x / 2, this.s.y / 2 - 3, 5, 5, 0, 0, Math.PI * 2);
        ctx.rect(this.s.x / 2 - 2, this.s.y / 2, 4, 8);
        ctx.fillStyle = COLORS.gray;
        ctx.fill();
        ctx.restore();
    }
}
