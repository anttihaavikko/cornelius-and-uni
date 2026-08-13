import { drawEllipse, fillRect } from './drawing';
import { Entity } from './entity';
import { Game } from './game';
import { moveTowards } from './math';
import { Mouse } from './mouse';

export class Eye extends Entity {
    protected openess = 1;
    protected targetOpeness = 1;
    protected timer: NodeJS.Timeout;
    protected color = '#fff';

    constructor(game: Game, x: number, y: number, size: number) {
        super(game, x, y, size, size);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.openess = moveTowards(this.openess, this.targetOpeness, 0.075);
    }

    public getColor(): string {
        return this.color;
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public setSize(size: number): void {
        this.s = { x: size, y: size };
    }

    public draw(ctx: CanvasRenderingContext2D, sleeping?: boolean): void {
        const prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = this.color;
        if (!sleeping) drawEllipse(ctx, this.p, this.s.x * Math.min(1.1, 1 / this.openess), this.s.y * this.openess, this.color);
        if (sleeping) fillRect(ctx, this.p.x, this.p.y + 6, 20, 7);
        ctx.globalCompositeOperation = prev;
    }

    public blink(blinkDuration: number): void {
        clearTimeout(this.timer);
        this.targetOpeness = 0;
        this.timer = setTimeout(() => this.open(), blinkDuration);
    }

    private open(): void {
        this.targetOpeness = 1;
    }
}