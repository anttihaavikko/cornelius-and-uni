import { Entity } from './engine/entity';
import { Face } from './engine/face';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { magnitude, Vector } from './engine/vector';
import { Limbs } from './limbs';

export class Dude extends Entity {
    protected limbs = new Limbs([[10, 0], [-10, 0]], [[15, 0], [-15, 0]]);
    protected speed = 5;
    protected face: Face;

    public controlled: boolean;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 5, 5);
        this.face = new Face(game, { width: 1, mouthColor: '#000', mouthThickness: 12 });
        this.face.setEyeColor('#000');
        this.face.p.y = -18;
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.limbs.update(tick);
        this.face.update(tick, mouse);
        this.d = this.p.y;

        if (!this.controlled) return;
        const dir: Vector = { x: 0, y: 0 };
        if (this.game.held['ArrowLeft'] || this.game.held['a']) dir.x -= this.speed;
        if (this.game.held['ArrowRight'] || this.game.held['d']) dir.x += this.speed;
        if (this.game.held['ArrowUp'] || this.game.held['w']) dir.y -= this.speed;
        if (this.game.held['ArrowDown'] || this.game.held['s']) dir.y += this.speed;
        this.limbs.walking = magnitude(dir) > 0;
        this.p.x += dir.x;
        this.p.y += dir.y;
    }

    drawBody(ctx: CanvasRenderingContext2D, phase: number): void {
        ctx.lineWidth = 25;
        ctx.beginPath();
        ctx.moveTo(0, -5 + phase);
        ctx.lineTo(0, -30 + phase);
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 20;
        ctx.stroke();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);

        ctx.fillStyle = '#00000033';
        ctx.beginPath();
        ctx.ellipse(0, 1, 20, 8, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.rotate(this.limbs.walking ? -this.limbs.walkPhase * 0.1 : 0);

        const phase = this.animationPhaseAbs * -5 - 10;
        this.limbs.root = phase;

        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        ctx.lineWidth = 8;
        this.limbs.draw(ctx);

        this.drawBody(ctx, phase);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        this.limbs.draw(ctx);

        ctx.translate(this.face.p.x, this.face.p.y + phase);
        ctx.scale(0.1, 0.1);
        this.face.draw(ctx);

        ctx.restore();
    }
}
