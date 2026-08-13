import { font } from './constants';
import { Game } from './game';
import { clamp01 } from './math';
import { Mouse } from './mouse';
import { plusMinus, random } from './random';
import { TextEntity, TextOptions } from './text';
import { Vector, ZERO } from './vector';


export class WobblyText extends TextEntity {
    private time = 0;
    private timer: NodeJS.Timeout;
    private width: number;
    private mirrors: Vector[] = [];
    private scrambled: boolean = false;
    private font: string = font;

    constructor(game: Game, content: string, fontSize: number, x: number, y: number, private frequency: number, private amplitude: number, options?: TextOptions) {
        super(game, content, fontSize, x, y, -1, ZERO, options);
        this.scale = { x: 1, y: 1 };
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.tween.update(tick);
        this.time = tick;
    }

    public toggle(text: string): void {
        clearTimeout(this.timer);
        const dur = random(0.2, 0.5);
        this.timer = setTimeout(() => {
            this.content = text;
            this.scramble(this.scrambled);
        }, text ? 0 : (dur * 1000));
        const s = text ? 1 : 0;
        this.tween.scale({ x: s, y: s }, dur);
    }

    public changeFontSize(size: number): void {
        this.fontSize = size;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.rotate(this.options?.angle ?? 0);
        this.ratio = clamp01(this.scale.x);
        const mod = this.options?.scales ? this.ratio : 1;
        ctx.textAlign = 'left';
        ctx.font =`${this.fontSize * mod}px ${font}`;

        // if(this.options?.shadow) {
        //     ctx.fillStyle = "#000";
        //     ctx.fillText(this.content.replace(/\|/g, ""), this.p.x + this.options.shadow, this.p.y + this.options.shadow);
        // }
        
        const spacing = this.options?.spacing ?? 0;
        const w = this.getWidth(ctx);
        this.width = w;

        // ctx.translate(w * 0.25, 0);
        // ctx.scale(0.5, 0.5);
        // ctx.translate(-w * 0.25, 0);

        ctx.lineJoin = 'round';

        let useColor = false;

        if (this.options?.background) {
            ctx.fillStyle = this.options.background;
            ctx.beginPath();
            ctx.rect(this.p.x - w * 0.5 - 15, this.p.y - 30, w + 30, 47);
            ctx.fill();
            if (this.options?.border) {
                ctx.strokeStyle = this.options.border;
                ctx.lineWidth = this.options.borderWidth ?? 1;
                ctx.stroke();
            }
        }

        let offset = (this.options?.align === 'center' || !this.options?.align ? -w * 0.5 : 0) - this.content.replace(/\|/g, '').length * spacing * 0.5;
        if (this.options?.align == 'right') offset = -w;
        let i = 0;

        ctx.translate(this.p.x + offset, this.p.y);
        this.content.split('').forEach((letter) => {
            if (letter === '|') {
                useColor = !useColor;
                return;
            }
            const mx = this.mirrors[i]?.x ?? 1;
            const my = this.mirrors[i]?.y ?? 1;
            const metrics = ctx.measureText(letter);
            const w = metrics.width;
            const h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent * 0.5;
            ctx.save();
            ctx.translate(w * 0.5, -h * 0.5);
            ctx.scale(mx, my);
            ctx.translate(-w * 0.5, h * 0.5);
            // ctx.font =`${this.fontSize * mod * (this.content[i - 1] === ' ' ? 1.2 : 1)}px ${font}`;
            if (this.options?.shadow) {
                ctx.fillStyle = '#000';
                ctx.fillText(letter, spacing * i * mx + this.options.shadow * mx, this.options.shadow * my + Math.sin(this.time * 0.005 + i * this.frequency) * this.amplitude * my);
            }
            ctx.fillStyle = useColor ? '#FBB13C' : (this.options?.color ?? '#fff');
            if (this.options?.outline) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = this.options.outline * this.ratio;
                ctx.strokeText(letter, spacing * i * mx, Math.sin(this.time * 0.005 + i * this.frequency) * this.amplitude * my);
            }
            ctx.fillText(letter, spacing * i * mx, Math.sin(this.time * 0.005 + i * this.frequency) * this.amplitude * my);
            ctx.restore();
            ctx.translate(w, 0);
            i++;
        });

        ctx.restore();
    }

    public setFont(to: string): void {
        this.font = to;
    }

    public scramble(state: boolean = true): void {
        this.scrambled = state;
        this.mirrors = state ? this.content.replace(/\|/g, '').split('').map(() => ({ x: plusMinus(), y: plusMinus() })) : [];
    }

    public getPrevWidth(): number {
        return this.width;
    }

    public getWidth(ctx: CanvasRenderingContext2D): number {
        const mod = this.options?.scales ? this.ratio : 1;
        ctx.font =`${this.fontSize * mod}px ${this.font}`;
        return Math.max(...this.content.split('\n').map(t => ctx.measureText(t.replace(/\|/g, '')).width));
    }

    public setSize(size: number, shadow: number): void {
        this.fontSize = size;
        this.options.shadow = shadow;
    }
}