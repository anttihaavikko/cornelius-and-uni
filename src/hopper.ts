import { Entity } from './engine/entity';
import { distance, Vector } from './engine/vector';

export class Hopper extends Entity {
    public pair: Hopper;

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffffff66';
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.translate(this.p.x, this.p.y);
        ctx.ellipse(0, 0, 50, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.setLineDash([]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public isInside(point: Vector, radius?: number): boolean {
        return distance(point, this.p) < 40;
    }
}
