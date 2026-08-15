import { Collider } from './collider';
import { COLORS } from './colors';
import { Bubble } from './engine/bubble';
import { quadEaseInOut } from './engine/easings';
import { Face } from './engine/face';
import { Game } from './engine/game';
import { clamp01 } from './engine/math';
import { Mouse } from './engine/mouse';
import { magnitude, normalize, offset, Vector } from './engine/vector';
import { Item, ItemType } from './item';
import { Limbs } from './limbs';
import { Scene } from './scene';
import { Shadowed } from './shadowed';

export class Dude extends Shadowed {
    protected speed = 0;
    protected limbs = new Limbs([[10, 0], [-10, 0]], [[15, 0], [-15, 0]]);
    protected maxSpeed = 5;
    protected face: Face;
    protected velocity: Vector = { x: 0, y: 0 };
    protected holdPos = -30;
    protected carryOffset = 7;

    public skin = COLORS.skin;
    public controlled = false;
    public riding = false;
    public held: Item;
    public aim: Vector = { x: 0, y: 0 };
    public mount: Dude;
    public bubble: Bubble;
    public scene: Scene;

    private animating = false;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 5, 5);
        this.face = new Face(game, { width: 1, mouthColor: '#000', mouthThickness: 12, blush: COLORS.red });
        this.face.setEyeColor('#000');
        this.face.p.y = -18;
        this.bubble = new Bubble(game, '', 0, -50, { direction: 'center' });
    }

    talk(text: string): void {
        this.bubble.setText('');
        this.bubble.continueText(text);
    }

    carry(state: boolean): void {
        this.limbs.armPos = state ? -16 : 10;
    }

    moveWithMount(): void {
        if (this.animating) return;
        this.p = offset(this.mount.p, 0, 2 + this.mount.animationPhaseAbs * -5);
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.bubble.update(tick, mouse);
        this.limbs.update(tick);
        this.face.update(tick, mouse);
        this.d = this.p.y;

        if (this.animating) return;

        this.limbs.walking = magnitude(this.velocity) > 0 && !this.mount;

        if (this.limbs.walking) {
            this.bubble.setText('');
        }

        const next = offset(this.p, this.velocity.x * this.maxSpeed * this.speed, this.velocity.y * this.maxSpeed * this.speed);
        if (!this.collides(next)) {
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

    collides(pos: Vector): boolean {
        return false;
        if (this.game.platforms.some(p => p.isInside(pos))) return false;

        return this.game.colliders.some(c => {
            const hit = c.isInside(pos, 20);
            const coll = c as Collider;
            if (hit && coll.door && !coll.opened && this.held?.itemType === ItemType.Key) {
                coll.opened = true;
                this.held.drop(pos);
                this.carry(false);
                this.scene.remove(this.held);
                this.held = null;
            }
            return hit && !coll.opened;
        });
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

    lockFor(duration: number = 300): void {
        this.animating = true;
        setTimeout(() => this.animating = false, duration);
    }

    dismount(): void {
        if (!this.mount) return;
        // this.mount.hop(this.mount.p);
        const spot = offset(this.mount.p, this.mount.aim.x * 40, this.mount.aim.y * 40);
        const alt = offset(this.mount.p, this.mount.aim.x * -40, this.mount.aim.y * -40);
        // this.p = this.collides(spot) ? alt : spot;
        this.p = offset(this.mount.p, 0, -40);
        this.hop(this.collides(spot) ? alt : spot);
    }

    hop(pos: Vector): void {
        this.lockFor();
        this.tween.setEase(quadEaseInOut);
        this.tween.move(pos, 0.3);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y - Math.sin(this.tween.time * Math.PI) * 20);
        // console.log(this.tween.time);

        if (this.mount && !this.animating) {
            ctx.rotate(this.mount.limbs.walking ? -this.mount.limbs.walkPhase * 0.075 : 0);
            ctx.translate(0, -40 - Math.sin(this.mount.tween.time * Math.PI) * 20);
        }

        ctx.rotate(this.limbs.walking ? -this.limbs.walkPhase * 0.1 : 0);
        ctx.translate(0, this.limbs.walking ? -Math.abs(this.limbs.walkPhase) * 2 : 0);

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

        ctx.save();
        ctx.translate(this.face.p.x, this.face.p.y + phase);
        ctx.scale(0.1, 0.1);
        this.face.draw(ctx);
        ctx.restore();

        if (this.held) {
            this.held.p = offset(this.p, this.limbs.walking ? this.limbs.walkPhase * -5 : 0, this.holdPos + phase);
            this.held.d = this.d + this.carryOffset;
        }

        this.bubble.draw(ctx);

        ctx.restore();
    }
}
