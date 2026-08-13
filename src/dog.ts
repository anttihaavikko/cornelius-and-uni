import { Dude } from './dude';
import { roundRect } from './engine/drawing';
import { Face } from './engine/face';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { Vector } from './engine/vector';
import { Limbs } from './limbs';

export class Dog extends Dude {
    public target: Vector = { x: 0, y: 0 };

    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
        this.animationOffset = 1.5;
        this.speed = 4.5;
        this.limbs = new Limbs([[10, 0], [20, 0], [-20, 0], [-10, 0]], []);
        this.face = new Face(game, { width: 1, mouthColor: '#000', animal: false, mouthThickness: 12 });
        this.face.setEyeColor('#000');
        this.face.p.y = -8;
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);

        const dx = this.target.x - this.p.x;
        const dy = this.target.y - this.p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.limbs.walking = distance > 50;
        if (distance > 50) {
            this.p.x += dx / distance * this.speed;
            this.p.y += dy / distance * this.speed;
        }
    }

    drawBody(ctx: CanvasRenderingContext2D, phase: number): void {
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#fff';
        roundRect(ctx, -25, -25 + phase, 50, 30, 5);
        ctx.fill();
        ctx.stroke();
    }
}
