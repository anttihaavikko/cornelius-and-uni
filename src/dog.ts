import { Dude } from './dude';
import { roundRect } from './engine/drawing';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { Vector } from './engine/vector';
import { Limbs } from './limbs';

export class Dog extends Dude {
    public target: Vector = { x: 0, y: 0 };
    public wandering = false;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
        this.animationOffset = 1.5;
        this.maxSpeed = 4.5;
        this.skin = '#fff';
        this.limbs = new Limbs([[10, 0], [20, 0], [-20, 0], [-10, 0]], []);
        this.face.setEyeColor('#000');
        this.face.p.y = -8;
        this.shadowWidth = 30;
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);

        const dx = this.target.x - this.p.x;
        const dy = this.target.y - this.p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.limbs.walking = distance > 100;
        if (distance > 100) {
            this.p.x += dx / distance * this.maxSpeed;
            this.p.y += dy / distance * this.maxSpeed;
        }
    }

    drawBody(ctx: CanvasRenderingContext2D, phase: number): void {
        ctx.lineWidth = 2.5;
        ctx.fillStyle = this.skin;
        roundRect(ctx, -25, -25 + phase, 50, 30, 5);
        ctx.fill();
        ctx.stroke();
    }
}
