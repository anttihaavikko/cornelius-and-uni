import { Dude } from './dude';
import { roundRect } from './engine/drawing';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { random } from './engine/random';
import { magnitude, normalize, offset, Vector, ZERO } from './engine/vector';
import { Limbs } from './limbs';

export class Dog extends Dude {
    public target: Vector = { x: 0, y: 0 };
    public wandering = false;
    private waiting = false;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
        this.animationOffset = 1.5;
        this.maxSpeed = 4.5;
        this.skin = '#fff';
        this.limbs = new Limbs([[10, 0], [20, 0], [-20, 0], [-10, 0]], []);
        this.face.setEyeColor('#000');
        this.face.p.y = -8;
        this.shadowWidth = 30;
        this.holdPos = -25;
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
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
        this.limbs.walking = magnitude(this.velocity) > 0;
    }

    drawBody(ctx: CanvasRenderingContext2D, phase: number): void {
        ctx.lineWidth = 2.5;
        ctx.fillStyle = this.skin;
        roundRect(ctx, -25, -25 + phase, 50, 30, 5);
        ctx.fill();
        ctx.stroke();
    }
}
