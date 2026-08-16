import { Collider } from './collider';
import { COLORS } from './colors';
import { drawEllipse } from './engine/drawing';
import { Entity } from './engine/entity';

export class House extends Entity {
    public entered = false;
    public walls: Collider[] = [];
    public decorations: number[] = [];
    public roof = COLORS.red;

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
        // ctx.rect(0, -50, this.s.x, this.s.y - 50);
        ctx.fillStyle = this.roof;
        ctx.moveTo(0, -50);
        ctx.lineTo(this.s.x * 0.5, -150);
        ctx.lineTo(this.s.x, -50);
        ctx.lineTo(this.s.x, this.s.y - 100);
        ctx.lineTo(this.s.x * 0.5, this.s.y - 200);
        ctx.lineTo(0, this.s.y - 100);
        ctx.closePath();
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
        ctx.rect(0, -100, this.s.x, 100);
        ctx.fillStyle = COLORS.light;
        ctx.fill();
        const size = 40 + this.animationPhaseAbs * 2;
        drawEllipse(ctx, { x: this.s.x * 0.5, y: this.s.y + 10 }, size, size, '#ffffff22');

        if (this.decorations.includes(0)) {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.translate(-5, -20);
            ctx.rect(50, 50, 20, 20);
            ctx.rect(20, 80, 20, 20);
            ctx.rect(50, 80, 20, 20);
            ctx.rect(80, 80, 20, 20);
            ctx.translate(30, 0);
            ctx.rect(20, 120, 80, 20);
            ctx.moveTo(40, 127);
            ctx.lineTo(40, 132);
            ctx.lineTo(80, 132);
            ctx.lineTo(80, 127);
            ctx.strokeStyle = '#00000022';
            ctx.stroke();
        }

        if (this.decorations.includes(1)) {
            ctx.beginPath();
            ctx.translate(25, -80);
            ctx.rect(0, 0, 150, 60);
            ctx.fillStyle = COLORS.skin;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2.5;
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(10, 50);
            ctx.lineTo(50, 40);
            ctx.lineTo(40, 10);
            ctx.lineTo(85, 10);
            ctx.lineTo(90, 30);
            ctx.lineTo(140, 20);
            const drawTree = (x: number, y: number) => {
                ctx.moveTo(x - 3, y);
                ctx.lineTo(x, y - 10);
                ctx.lineTo(x + 3, y);
            };
            drawTree(55, 23);
            drawTree(70, 30);
            drawTree(80, 40);
            drawTree(60, 45);
            drawTree(72, 50);
            ctx.moveTo(78, 25);
            ctx.ellipse(70, 25, 8, 8, 0, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = COLORS.gray;
            ctx.stroke();
        }

        ctx.restore();
    }
}
