import { COLORS } from './colors';
import { Game } from './engine/game';
import { distance, offset, Vector } from './engine/vector';
import { Item, ItemType } from './item';
import { Scene } from './scene';
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

    private slots: Item[] = [null, null, null, null, null];
    private word: string = '';
    private lines: string[] = [];

    private commands: { commands: string[]; out?: string; act?: (s: Scene) => void }[] = [
        { commands: ['uni'], act: s => s.free() },
        { commands: ['gun', 'gin', 'keg', 'wine', 'nuke', 'kiwi', 'kink', 'ink', 'yen', 'ice'], act: (s: Scene) => this.spawn(s) },
        { commands: ['ui', 'gui'], out: 'ONLY TEXT INTERFACE FOUND!' },
        { commands: ['kick', 'fuck'], out: 'YOU BETTER WATCH OUT!' },
        { commands: ['in'], out: 'YES, AWAITING INPUT!' },
        { commands: ['ign'], out: 'HAHA, NO... ;)' },
        { commands: ['key'], act: s => this.addItem(s, ItemType.Key) },
        { commands: ['egg'], act: s => this.addItem(s, ItemType.Egg) },
        { commands: ['eye'], act: s => this.addItem(s, ItemType.Eye) },
        { commands: ['guy', 'wife'], act: s => this.addItem(s, ItemType.Dude) },
    ];

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 80, 30);
        this.evaluate();
    }

    private addItem(scene: Scene, type: ItemType, letter?: string): void {
        const p = this.getSpawnPos();
        scene.addItem(p.x, p.y, type, letter);
    }

    private getSpawnPos(): Vector {
        return offset(this.spots[0], this.p.x, this.p.y + 10);
    }

    private spawn(scene: Scene): void {
        return scene.createPackage(this.getSpawnPos(), this.word);
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
        this.word = this.slots.slice(1).filter(s => s?.itemType === ItemType.Letter).map(s => s?.letter).join('').trim();
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
        ctx.lineWidth = 3;
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

    operate(scene: Scene): void {
        let line = 'ERROR, UNKNOWN COMMAND!';
        const cmd = this.commands.find(c => c.commands.includes(this.word));
        if (cmd && cmd.out) line = cmd.out;
        if (cmd && cmd.act) {
            cmd.act(scene);
            line = 'SUCCESS!';
        }
        this.lines = ['IN:~> ' + this.word.toUpperCase(), 'EXECUTING!', '---', line];
    }
}
