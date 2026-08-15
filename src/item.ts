import { COLORS } from './colors';
import { Dude } from './dude';
import { font } from './engine/constants';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { Vector } from './engine/vector';
import { Shadowed } from './shadowed';

export enum ItemType {
    Letter,
    Key,
    Battery,
    Package,
    Chicken,
    Fox,
    Wheat,
    Egg,
    Eye,
    Dude,
    Unit
}

export class Item extends Shadowed {
    public held: boolean;
    public locked: boolean;

    private origin: Vector;
    private dude: Dude;

    constructor(game: Game, x: number, y: number, public itemType: number, public letter?: string) {
        super(game, x, y, 0, 0);
        this.d = this.p.y;
        this.origin = this.p;

        if (itemType == ItemType.Dude) {
            this.dude = new Dude(game, 0, 0);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public act(dude: Dude): void {
    }

    public reset(): void {
        this.p = this.origin;
        this.d = this.p.y;
    }

    public drop(pos: Vector): void {
        this.p = pos;
        this.d = this.p.y;
        this.held = false;
        this.shadowShown = true;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.dude?.update(tick, mouse);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.beginPath();
        ctx.rotate(this.rotation);
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';

        this.dude?.draw(ctx);

        if (this.itemType == ItemType.Chicken) {
            ctx.lineWidth = 5;
            ctx.ellipse(0, -30, 10, 10, 0, 0, 2 * Math.PI);
            ctx.moveTo(-14, 0);
            ctx.bezierCurveTo(-14, -35, 14, -35, 14, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = COLORS.red;
            ctx.ellipse(0, -45, 2, 5, 0, 0, 2 * Math.PI);
            ctx.moveTo(0, -20);
            ctx.ellipse(0, -18, 2, 5, 0, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = COLORS.brown;
            ctx.moveTo(-3, -28);
            ctx.lineTo(0, -20);
            ctx.lineTo(3, -28);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        if (this.itemType == ItemType.Fox) {
            ctx.lineWidth = 10;
            ctx.fillStyle = COLORS.red;
            ctx.moveTo(12, -5);
            ctx.quadraticCurveTo(12, -20, 20, -30);
            ctx.stroke();
            ctx.lineWidth = 5;
            ctx.strokeStyle = COLORS.red;
            ctx.stroke();
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.moveTo(20, -30);
            ctx.lineTo(18, -28);
            ctx.stroke();
            ctx.strokeStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(-10, -30);
            ctx.ellipse(-10, -30, 10, 10, 0, Math.PI * 1.25, 0.95 * Math.PI);
            ctx.closePath();
            ctx.moveTo(-14, 0);
            ctx.bezierCurveTo(-14, -35, 14, -35, 14, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        if (this.itemType == ItemType.Wheat) {
            ctx.lineWidth = 5;
            ctx.fillStyle = COLORS.yellow;
            ctx.moveTo(-14, 0);
            ctx.lineTo(-7, -20);
            ctx.lineTo(0, -25);
            ctx.lineTo(7, -20);
            ctx.lineTo(14, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            const dotAt = (x: number, y: number) => {
                ctx.moveTo(x, -y);
                ctx.lineTo(x, -y);
            };
            dotAt(-8, 5);
            dotAt(5, 8);
            dotAt(3, 16);
            dotAt(-3, 18);
            dotAt(-2, 12);
            dotAt(9, 4);
            ctx.strokeStyle = '#00000022';
            ctx.stroke();
        }

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

        if (this.itemType == ItemType.Unit) {
            ctx.fillStyle = '#000';
            ctx.rect(-25, -30, 50, 30);
            ctx.fillStyle = COLORS.gray;
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(-25, -15 - 30, 50, 20);
            ctx.fillStyle = COLORS.light;
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.rect(-20, -20, 40, 15);
            ctx.fillStyle = '#000';
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `8px ${font}`;
            ctx.fillText(this.letter.toUpperCase(), 0, -12);
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
                ctx.stroke();
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
