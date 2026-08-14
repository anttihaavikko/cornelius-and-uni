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

        if (this.itemType == ItemType.Letter) {
            ctx.rect(-15, -30, 30, 30);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `20px ${font}`;
            ctx.fillText(this.letter.toUpperCase(), 0, -12);
        }

        ctx.restore();
    }
}
