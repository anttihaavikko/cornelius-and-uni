import { drawEllipse } from './drawing';
import { Entity } from './entity';
import { Eye } from './eye';
import { Game } from './game';
import { moveTowards } from './math';
import { Mouse } from './mouse';
import { random } from './random';

export interface FaceOptions {
    blush?: string;
    blinkDuration?: number;
    blinkDiff?: number;
    width?: number;
    eyeSize?: number;
    blushSize?: number;
    mouthWidth?: number;
    mouthThickness?: number;
    color?: string;
    blushOffset?: number;
    animal?: boolean;
    noBlink?: boolean;
    mouthColor?: string;
}

const defaultOptions: FaceOptions = {
    blush: '#FE6847',
    eyeSize: 10,
    width: 1,
    blinkDiff: 150,
    blinkDuration: 200,
    blushSize: 1.3,
    mouthWidth: 1,
    mouthThickness: 7,
    blushOffset: 0,
    color: '#fff',
    mouthColor: '#fff'
};

export class Face extends Entity {
    public angry: boolean;
    public sleeping: boolean;
    // public thinking: boolean;

    private openess = 0;
    private targetOpeness = 0;
    private closeTimer: NodeJS.Timeout;

    private left: Eye;
    private right: Eye;
    private options: FaceOptions;
    private mirrorer = 1;

    constructor(game: Game, options: FaceOptions) {
        super(game, 0, 0, 0, 0);
        this.options = { ...defaultOptions };
        this.setOptions(options);
        this.blink(this.options.blinkDuration, this.options.blinkDiff);
        this.left = new Eye(game, -30 * this.options.width, 5, this.options.eyeSize);
        this.right = new Eye(game, 30 * this.options.width, 5, this.options.eyeSize);
    }

    public getOptions(): FaceOptions {
        return this.options;
    }

    public setOptions(options: FaceOptions): void {
        this.options = {
            ...this.options,
            ...options
        };
        this.left?.setColor(options.color);
        this.right?.setColor(options.color);
    }

    private blink(blinkDuration: number, blinkDiff: number): void {
        if (this.options.noBlink) return;
        setTimeout(() => this.blinkEye(this.left, blinkDuration, blinkDiff), random(0, blinkDiff));
        setTimeout(() => this.blinkEye(this.right, blinkDuration, blinkDiff), random(0, blinkDiff));
        setTimeout(() => this.blink(blinkDuration, blinkDiff), random(1000, 4000));
    }

    private blinkEye(eye: Eye, duration: number, diff: number): void {
        if (this.options.noBlink) return;
        eye.blink(duration), random(0, diff);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.openess = moveTowards(this.openess, this.targetOpeness, 0.1);
        this.left.update(tick, mouse);
        this.right.update(tick, mouse);
        if (Math.random() < 0.002) this.mirrorer *= -1;
    }

    public setEyeSize(size: number): void {
        this.left.setSize(size);
        this.right.setSize(size);
    }

    public setEyeColor(color: string): void {
        this.left.setColor(color);
        this.right.setColor(color);
    }

    public getEyeColor(): string {
        return this.left.getColor();
    }

    public draw(ctx: CanvasRenderingContext2D, drawBrows = true): void {
        drawEllipse(ctx, { x: -65 * this.options.width - this.options.blushOffset, y: 20 }, 15 * this.options.blushSize, 10 * this.options.blushSize, this.options.blush);
        drawEllipse(ctx, { x: 65 * this.options.width + this.options.blushOffset, y: 20 }, 15 * this.options.blushSize, 10 * this.options.blushSize, this.options.blush);

        ctx.fillStyle = '#000';

        this.left.draw(ctx, this.sleeping);
        this.right.draw(ctx, this.sleeping);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = this.options.mouthThickness;
        ctx.strokeStyle = this.options.color;
        ctx.fillStyle = this.options.color;

        if (this.angry && drawBrows) {
            ctx.beginPath();
            ctx.moveTo(-50 * this.options.width + 10, -5);
            ctx.lineTo(-50 * this.options.width - 20, -20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(50 * this.options.width - 10, -5);
            ctx.lineTo(50 * this.options.width + 20, -20);
            ctx.stroke();
        }

        // if (this.thinking && !this.angry) {
        //     ctx.beginPath();
        //     ctx.moveTo((-40 * this.options.width + 10) * this.mirrorer, -20);
        //     ctx.lineTo((-40 * this.options.width - 20) * this.mirrorer, -20);
        //     ctx.stroke();
        //     ctx.beginPath();
        //     ctx.moveTo((40 * this.options.width - 10) * this.mirrorer, -40);
        //     ctx.lineTo((40 * this.options.width + 20) * this.mirrorer, -35);
        //     ctx.stroke();
        // }

        // mouth
        ctx.save();
        ctx.scale(this.mirrorer, 1);
        ctx.beginPath();
        ctx.strokeStyle = this.options.mouthColor;
        const mw = this.options.width * this.options.mouthWidth;
        // const start = this.thinking ? 25 : 20;
        const curve = this.angry ? -30 : 0;
        if (this.options.animal) {
            const start = 30;
            ctx.save();
            ctx.translate(0, 5);
            // drawCircle(ctx, { x: 0, y: 12 }, 8, '#000', '#000');
            // ctx.moveTo(0, 10);
            // ctx.lineTo(-20, 0);
            // ctx.lineTo(20, 0);
            // ctx.closePath();
            // ctx.fill();
            ctx.lineWidth = this.options.mouthThickness * 0.01;
            ctx.beginPath();
            ctx.moveTo(-40 * mw, start);
            // this.openess = 1;
            ctx.quadraticCurveTo(-10, 40 + 10 * mw, 0, 15);
            ctx.quadraticCurveTo(10, 40 + 10 * mw, 40 * mw, start);
            ctx.restore();
        } else {
            const start = 20;
            ctx.moveTo(-40 * mw, start);
            ctx.quadraticCurveTo(0, 40 - 60 * mw * this.openess + curve, 40 * mw, 20);
            ctx.quadraticCurveTo(0, 40 + 60 * mw * this.openess + curve, -40 * mw, start);
        }
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    public openMouth(amount: number, closeDelay: number): void {
        clearTimeout(this.closeTimer);
        this.targetOpeness = amount;
        this.closeTimer = setTimeout(() => this.closeMouth(), closeDelay * 1000);
    }

    public closeMouth(): void {
        this.targetOpeness = 0;
    }

    public setColor(color: string): void {
        this.options.color = color;
        this.left.setColor(color);
        this.right.setColor(color);
    }

    public setBlushColor(color: string): void {
        this.options.blush = color;
    }
}