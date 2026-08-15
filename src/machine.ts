import { COLORS } from './colors';
import { Game } from './engine/game';
import { randomInt } from './engine/random';
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

    private unit: Item;
    private actModule: Item;
    private battery: Item;

    private target: string;
    private solved: boolean;
    private reward: string;

    private commands: { commands: string[]; out?: string; act?: (s: Scene) => void }[] = [
        { commands: ['uni'], act: s => s.free() },
        { commands: ['gun', 'gin', 'keg', 'wine', 'kiwi', 'kink', 'ink', 'yen', 'ice', 'glue', 'gel'], act: (s: Scene) => this.addItem(s, ItemType.Package, this.word) },
        { commands: ['ui', 'gui'], out: 'ONLY TEXT INTERFACE FOUND!' },
        { commands: ['kick', 'fuck', 'dick', 'dung', 'duel', 'hell', 'whip', 'nuke'], out: 'YOU BETTER WATCH OUT!' },
        { commands: ['in'], out: 'YES, AWAITING INPUT!' },
        { commands: ['ign'], out: 'HAHA, NO... ;)' },
        { commands: ['key'], act: s => this.addItem(s, ItemType.Key) },
        { commands: ['dice', 'die'], act: s => this.addItem(s, ItemType.Letter, randomInt(1, 6).toString()) },
        { commands: ['guy', 'wife', 'dyke', 'dude', 'duke', 'edgy', 'geek', 'gene', 'punk', 'unc', 'elf'], act: s => this.addItem(s, ItemType.Dude) },
        // { commands: ['held'], out: '!!!' },
        { commands: ['dupe'], act: s => this.dupe(s) },
        { commands: ['flip'], act: () => this.flip() },
        // { commands: ['find', 'clue', 'need', 'help'], out: '!!!' },
        // { commands: ['fun'], out: '!!!' },
        { commands: ['win'], act: s => this.addItem(s, ItemType.Trophy, '1/3') },
        { commands: ['end'], act: s => this.addItem(s, ItemType.Trophy, '2/3') },
        { commands: ['fin'], act: s => this.addItem(s, ItemType.Trophy, '3/3') },
        { commands: ['dye'], act: s => s.colorize(this.slots[0]) },
        { commands: ['pink'], act: s => s.colorize(this.slots[0], '#F2A6B3') },
        { commands: ['duck', 'chick', 'egg'], act: s => this.addItem(s, ItemType.Chicken) },
        { commands: ['wild', 'wily'], act: s => this.addItem(s, ItemType.Fox) },
        { commands: ['fen', 'weed', 'puke', 'feed', 'fuel'], act: s => this.addItem(s, ItemType.Wheat) },
    ];

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 80, 30);
        this.evaluate();
        this.unit = new Item(game, 0, -15, ItemType.Unit, 'fab');
        this.d = this.p.y;
    }

    private dupe(scene: Scene): void {
        if (!this.slots[0]) {
            this.lines[3] = 'ERROR, TARGET MISSING!';
            return;
        }
        const src = this.slots[0];
        this.slots[0] = null;
        src.p.y += 50;
        this.addItem(scene, src.itemType, src.letter);
    }

    private flip(): void {
        if (!this.slots[0]) {
            this.lines[3] = 'ERROR, TARGET MISSING!';
            return;
        }
        const pairs = ['w', 'm', 'u', 'a', 'l', 't', '2', 'z', '5', 's', '6', 'g'];
        if (!pairs.includes(this.slots[0].letter)) {
            this.lines[3] = 'ERROR, INVALID TARGET!';
            return;
        }
        const i = pairs.indexOf(this.slots[0].letter);
        this.slots[0].letter = pairs[i + (i % 2 == 0 ? 1 : -1)];
    }

    private addItem(scene: Scene, type: ItemType, letter?: string): void {
        if (this.slots[0] && !this.reward) {
            this.lines[3] = 'ERROR, OUTPUT BLOCKED!';
            return;
        }
        const p = this.getSpawnPos();
        this.slots[0] = scene.addItem(p.x, p.y, type, letter);
    }

    private getSpawnPos(): Vector {
        return offset(this.spots[0], this.p.x, this.p.y + 10);
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

    public makeWordle(word: string, hint: string, reward: string): void {
        this.reward = reward;
        this.target = word;
        this.lines = ['STUCK IN UNKNOWN ROUTINE!', '---', 'AWAITING INPUT...', 'REQUIRED SKILLS: ' + hint.toUpperCase()];
        this.unit.letter = '0/4';
    }

    public evaluateWordle(scene: Scene): void {
        if (this.solved) return;
        let correct = 0;
        this.slots.slice(1).forEach((s, i) => {
            if (this.target.includes(s?.letter)) {
                s.color = '#F6D7CB';
            }
            if (s?.letter == this.target[i]) {
                s.color = COLORS.yellow;
                correct++;
            }
        });
        this.unit.letter = correct + '/4';
        if (correct == 4) {
            this.solved = true;
            this.lines = ['ROUTINE COMPLETED!', '---', 'SHUTTING DOWN...'];
            this.addItem(scene, ItemType.Letter, this.reward);
        }
    }

    public evaluate(): void {
        if (!this.battery) {
            this.lines = ['EMERGENCY POWER MODE!', '---', 'INSERT BATTERY!'];
            return;
        }
        this.word = this.slots.slice(1).filter(s => s?.itemType === ItemType.Letter).map(s => s?.letter).join('').trim();
        this.lines = [this.actModule ? 'MULTIPLE MODULES ONLINE!' : 'FABRICATOR MODULE ONLINE!', 'AWAITING INPUT...', 'IN:~> ' + this.word.toUpperCase()];
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

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.strokeStyle = COLORS.gray;
        ctx.lineWidth = 3;
        ctx.stroke();

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
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.fillStyle = COLORS.brown;
        ctx.rect(-this.s.x * 0.5, -this.s.y, this.s.x, this.s.y);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = COLORS.yellow;
        ctx.beginPath();
        ctx.rect(-this.s.x * 0.5, -this.s.y, this.s.x, this.s.y - 9);
        ctx.fill();
        ctx.stroke();

        this.battery?.draw(ctx);
        this.unit.draw(ctx);
        this.actModule?.draw(ctx);

        ctx.restore();
    }

    addBattery(): void {
        this.battery = new Item(this.game, 12, -20, ItemType.Battery);
        this.evaluate();
    }

    addActModule(): void {
        this.actModule = new Item(this.game, 0, -40, ItemType.Unit, 'act');
        this.evaluate();
    }

    operate(scene: Scene): void {
        if (!this.battery) return;

        this.lines = ['IN:~> ' + this.word.toUpperCase(), 'EXECUTING!', '---', 'ERROR, UNKNOWN COMMAND!'];
        const cmd = this.commands.find(c => c.commands.includes(this.word));
        if (cmd && cmd.out) this.lines[3] = cmd.out;
        if (cmd && cmd.act) {
            this.lines[3] = 'SUCCESS!';
            cmd.act(scene);
        }
    }
}
