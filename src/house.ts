import { Collider } from './collider';
import { COLORS } from './colors';
import { drawEllipse } from './engine/drawing';
import { Entity } from './engine/entity';

export class House extends Entity {
    public entered = false;
    public walls: Collider[] = [];

    createWalls(): void {
        this.walls.push(new Collider(this.game, this.p.x - 10, this.p.y, 20, this.s.y));
        this.walls.push(new Collider(this.game, this.p.x + this.s.x - 10, this.p.y, 20, this.s.y));
        this.walls.push(new Collider(this.game, this.p.x, this.p.y - 10, this.s.x, 20));
        this.walls.push(new Collider(this.game, this.p.x, this.p.y + this.s.y - 10, this.s.x * 0.5 - 40, 20));
        this.walls.push(new Collider(this.game, this.p.x + this.s.x * 0.5 + 40, this.p.y + this.s.y - 10, this.s.x * 0.5 - 40, 20));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.d = this.p.y + this.s.y;

        if (this.entered) return;

        this.walls.forEach(w => w.draw(ctx));

        ctx.save();
        ctx.translate(this.p.x, this.p.y);

        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(0, 0, this.s.x, this.s.y);
        ctx.fillStyle = COLORS.skin;
        ctx.strokeStyle = '#000';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(0, -50, this.s.x, this.s.y - 50);
        ctx.fillStyle = COLORS.red;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(this.s.x * 0.5 - 30, this.s.y - 80, 60, 80);
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.restore();
    }

    public drawExterior(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rect(-10000, -5000, 10000, 10000);
        ctx.rect(this.s.x, -5000, 10000, 10000);
        ctx.rect(-5000, this.s.y, 10000, 10000);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.restore();
    }

    public drawInterior(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rect(0, 0, this.s.x, this.s.y);
        ctx.fillStyle = COLORS.gray;
        ctx.fill();
        ctx.beginPath();
        ctx.rect(-5000, -10000, 10000, 10000);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.beginPath();
        ctx.rect(0, -this.s.y * 0.5 + 50, this.s.x, 100);
        ctx.fillStyle = '#97A4AF';
        ctx.fill();
        const size = 40 + this.animationPhaseAbs * 2;
        drawEllipse(ctx, { x: this.s.x * 0.5, y: this.s.y + 10 }, size, size, '#ffffff22');
        ctx.restore();
    }
}
