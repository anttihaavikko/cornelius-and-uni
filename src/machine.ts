import { COLORS } from './colors';
import { Bubble } from './engine/bubble';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { distance, offset, Vector } from './engine/vector';
import { Item } from './item';
import { Shadowed } from './shadowed';

export class Machine extends Shadowed {
    public shadowWidth: number = 50;

    public spots: Vector[] = [
        { x: -90, y: 0 },
        { x: 100, y: 0 },
        { x: 150, y: 0 },
        { x: 200, y: 0 },
        { x: 250, y: 0 }
    ];

    private slots = [null, null, null, null, null];
    private word: string = '';
    private lines: string[] = [];

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 80, 30);
        this.evaluate();
    }

    public snap(pos: Vector, item: Item): Vector {
        for (const spot of this.spots) {
            const op = offset(this.p, spot.x, spot.y + 10);
            if (distance(pos, op) < 30 && this.slots[this.spots.indexOf(spot)] === null) {
                this.slots[this.spots.indexOf(spot)] = item;
                return op;
            }
        }
        return pos;
    }

    public evaluate(): void {
        this.word = this.slots.slice(1).map(s => s?.letter).join('');
        this.lines = ['FABRICATOR MODULE ONLINE!', 'AWAITING INPUT...', 'IN:~> ' + this.word.toUpperCase()];
    }

    public remove(item: Item): void {
        if (!this.slots.includes(item)) return;
        this.slots[this.slots.indexOf(item)] = null;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);

        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.rect(50, -110, 240, 80);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';

        this.lines.forEach((line, i) => {
            ctx.fillText(line, 60, -88 + i * 15, 240);
        });

        ctx.strokeStyle = '#ffffff33';
        ctx.beginPath();
        for (const spot of this.spots) {
            ctx.moveTo(0, -10);
            ctx.lineTo(spot.x, -10);
            ctx.lineTo(spot.x, spot.y);
            ctx.rect(spot.x - 22, spot.y, 44, 22);
        }
        ctx.stroke();


        ctx.beginPath();
        ctx.rotate(this.rotation);
        ctx.lineWidth = 2.5;
        ctx.fillStyle = COLORS.brown;
        ctx.strokeStyle = '#000';
        ctx.rect(-this.s.x * 0.5, -this.s.y, this.s.x, this.s.y);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    operate(): void {
        this.lines = ['IN:~> ' + this.word.toUpperCase(), 'EXECUTING!', '---', 'ERROR, UNKNOWN COMMAND!'];
    }
}
