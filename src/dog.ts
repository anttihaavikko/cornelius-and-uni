import { Dude } from './dude';
import { roundRect } from './engine/drawing';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { random } from './engine/random';
import { magnitude, normalize, offset, Vector, ZERO } from './engine/vector';
import { Limbs } from './limbs';

export class Dog extends Dude {
    public target: Vector = { x: 0, y: 0 };
    public locked = true;
    private waiting = false;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
        this.animationOffset = 1.5;
        this.maxSpeed = 4.5;
        this.skin = '#fff';
        this.limbs = new Limbs([[10, 0], [20, 0], [-20, 0], [-10, 0]], []);
        this.face.p.y = -8;
        this.shadowWidth = 33;
        this.holdPos = -25;
        this.carryOffset = -3;
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.face.p.x = this.animationPhase * 5;
        // if (this.locked) return;
        if (this.waiting || this.riding) {
            return;
        }
        const dx = this.target.x - this.p.x;
        const dy = this.target.y - this.p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.velocity = normalize(offset(this.velocity, dx * 0.1, dy * 0.1));
        if (distance < 50) {
            // this.velocity = Math.random() < 0.4 ? randomVector(random(0.5, 1)) : ZERO;
            this.velocity = ZERO;
            this.waiting = true;
            // this.target = offset(this.target, random(-500, 500), random(-500, 500));
            setTimeout(() => this.waiting = false, random(500, 1500));
        }
        this.speed = magnitude(this.velocity) > 0 ? 1 : 0;
        if (this.locked) this.speed *= 0.5;
        this.limbs.walking = magnitude(this.velocity) > 0;
    }

    drawBody(ctx: CanvasRenderingContext2D, phase: number): void {
        ctx.lineWidth = 2.5;
        ctx.fillStyle = this.skin;
        roundRect(ctx, -25, -25 + phase, 50, 30, 5);
        ctx.fill();
        ctx.stroke();
        const drawEar = (dir: number, scale: number = 1) => {
            ctx.save();
            ctx.translate(dir * 20, -20 + phase);
            ctx.scale(scale, scale);
            // ctx.rotate(dir * Math.PI);
            ctx.moveTo(dir * -5, -3);
            ctx.quadraticCurveTo(0, -12, dir * 10, -10 - this.animationPhaseAbs * -3);
            ctx.quadraticCurveTo(dir * 10, 0, dir * 2, 3);
            ctx.restore();
        };
        ctx.lineWidth = 2;
        ctx.beginPath();
        drawEar(1);
        drawEar(-1);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#E85D75';
        drawEar(1, 0.5);
        drawEar(-1, 0.5);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1.6;
        ctx.save();
        ctx.translate(this.face.p.x, this.face.p.y - 5 + phase);
        ctx.rotate(this.face.p.x * 0.05);
        ctx.moveTo(-3, 0);
        ctx.lineTo(3, 0);
        ctx.lineTo(0, -25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
