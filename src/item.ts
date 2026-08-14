import { COLORS } from './colors';
import { Dude } from './dude';
import { font } from './engine/constants';
import { Game } from './engine/game';
import { Vector } from './engine/vector';
import { Shadowed } from './shadowed';

export enum ItemType {
    Letter,
    Key,
    Battery,
    Package,
}

export class Item extends Shadowed {
    public held: boolean;
    public locked: boolean;

    constructor(game: Game, x: number, y: number, public itemType: number, public letter?: string) {
        super(game, x, y, 0, 0);
        this.d = this.p.y;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public act(dude: Dude): void {
    }

    public drop(pos: Vector): void {
        this.p = pos;
        this.d = this.p.y;
        this.held = false;
        this.shadowShown = true;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rotate(this.rotation);
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';

        if (this.itemType == ItemType.Key) {
            ctx.lineWidth = 8;
            ctx.translate(-10, -5);
            ctx.rotate(0.2);
            ctx.ellipse(0, 0, 8, 8, 0, 0, 2 * Math.PI);
            ctx.moveTo(10, 0);
            ctx.lineTo(30, 0);
            ctx.lineTo(30, -5);
            ctx.moveTo(22, 0);
            ctx.lineTo(22, -5);
            ctx.stroke();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = COLORS.light;
            ctx.stroke();
        }

        if (this.itemType == ItemType.Battery) {
            ctx.rect(-20, -20, 40, 20);
            ctx.rect(20, -15, 5, 10);
            ctx.fillStyle = COLORS.light;
            ctx.fill();
            ctx.stroke();
        }

        if (this.itemType == ItemType.Letter || this.itemType == ItemType.Package) {
            const size = this.itemType == ItemType.Letter ? 30 : 50;
            ctx.fillStyle = this.itemType == ItemType.Letter ? '#fff' : COLORS.brown;
            ctx.rect(-size * 0.5, -size, size, size);
            ctx.fill();
            ctx.stroke();
            if (this.itemType == ItemType.Package) {
                ctx.beginPath();
                ctx.translate(0, -10);
                ctx.rect(-size * 0.5, -25, size, 20);
                ctx.translate(0, -1.5);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.stroke()
            }
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${this.itemType == ItemType.Letter ? 20 : 15}px ${font}`;
            ctx.fillText(this.letter.toUpperCase(), 0, -12);
        }

        ctx.restore();
    }
}
