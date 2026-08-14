import { COLORS } from './colors';
import { Face } from './engine/face';
import { Game } from './engine/game';
import { clamp01 } from './engine/math';
import { Mouse } from './engine/mouse';
import { magnitude, normalize, offset, Vector } from './engine/vector';
import { Item } from './item';
import { Limbs } from './limbs';
import { Shadowed } from './shadowed';

export class Dude extends Shadowed {
    protected speed = 0;
    protected limbs = new Limbs([[10, 0], [-10, 0]], [[15, 0], [-15, 0]]);
    protected maxSpeed = 5;
    protected face: Face;
    protected skin = COLORS.skin;
    protected velocity: Vector = { x: 0, y: 0 };
    protected holdPos = -30;

    public controlled = false;
    public riding = false;
    public held: Item;
    public aim: Vector = { x: 0, y: 0 };
    public mount: Dude;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 5, 5);
        this.face = new Face(game, { width: 1, mouthColor: '#000', mouthThickness: 12, blush: COLORS.red });
        this.face.setEyeColor('#000');
        this.face.p.y = -18;
    }

    carry(state: boolean): void {
        this.limbs.armPos = state ? -16 : 10;
    }

    moveWithMount(): void {
        this.p = offset(this.mount.p, 0, 2 + this.mount.animationPhaseAbs * -5);
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.limbs.update(tick);
        this.face.update(tick, mouse);
        this.d = this.p.y;

        this.limbs.walking = magnitude(this.velocity) > 0;

        const next = offset(this.p, this.velocity.x * this.maxSpeed * this.speed, this.velocity.y * this.maxSpeed * this.speed);
        if (!this.game.colliders.some(c => c.isInside(next, 20))) {
            this.p = next;
        }

        if (this.controlled === this.riding) return;

        this.velocity = { x: 0, y: 0 };
        if (this.game.held['ArrowLeft'] || this.game.held['a']) this.velocity.x -= 1;
        if (this.game.held['ArrowRight'] || this.game.held['d']) this.velocity.x += 1;
        if (this.game.held['ArrowUp'] || this.game.held['w']) this.velocity.y -= 1;
        if (this.game.held['ArrowDown'] || this.game.held['s']) this.velocity.y += 1;

        if (magnitude(this.velocity) > 0) {
            this.velocity = normalize(this.velocity);
            this.aim = this.velocity;
            this.speed = clamp01(this.speed + this.delta * 0.005) * (this.riding ? 2 : 1);
        } else {
            this.speed = 0;
        }
    }

    drawBody(ctx: CanvasRenderingContext2D, phase: number): void {
        ctx.lineWidth = 25;
        ctx.beginPath();
        ctx.moveTo(0, -5 + phase);
        ctx.lineTo(0, -30 + phase);
        ctx.stroke();

        ctx.strokeStyle = this.skin;
        ctx.lineWidth = 20;
        ctx.stroke();
    }

    setRigindPos(dog: Dude): void {
        this.p = offset(dog.p, 0, 2 + dog.animationPhaseAbs * -5);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);

        if (this.mount) {
            ctx.rotate(this.mount.limbs.walking ? -this.mount.limbs.walkPhase * 0.075 : 0);
            ctx.translate(0, -40);
        }

        ctx.rotate(this.limbs.walking ? -this.limbs.walkPhase * 0.1 : 0);

        const phase = this.animationPhaseAbs * -5 - 10;
        this.limbs.root = phase;

        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        ctx.lineWidth = 8;
        this.limbs.draw(ctx);

        this.drawBody(ctx, phase);

        ctx.strokeStyle = this.skin;
        ctx.lineWidth = 4;
        this.limbs.draw(ctx);

        ctx.translate(this.face.p.x, this.face.p.y + phase);
        ctx.scale(0.1, 0.1);
        this.face.draw(ctx);

        if (this.held) {
            this.held.p = offset(this.p, this.limbs.walking ? this.limbs.walkPhase * -5 : 0, this.holdPos + phase);
            this.held.d = this.d + 5;
        }

        ctx.restore();
    }
}
