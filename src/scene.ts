import { Collider } from './collider';
import { COLORS } from './colors';
import { Dog } from './dog';
import { Dude } from './dude';
import { Container } from './engine/container';
import { Entity } from './engine/entity';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { random, randomInt } from './engine/random';
import { distance, offset, Vector } from './engine/vector';
import { Hopper } from './hopper';
import { House } from './house';
import { Item, ItemType } from './item';
import { Machine } from './machine';
import { Raft } from './raft';
import { River } from './river';
import { Shadowed } from './shadowed';
import { Sign } from './sign';
import { Tree } from './tree';

export class Scene extends Container {
    private dude: Dude;
    private dog: Dog;
    private items: Item[] = [];
    private houses: House[] = [];
    private inside: House;
    private tree: Vector = { x: 125, y: 478 };
    private machine: Machine;
    private wordles: Machine[] = [];
    private river: River;

    private chicken: Item;
    private fox: Item;
    private wheat: Item;
    private puzzleCompleted = false;

    private puzzleStart: Vector = { x: 2097, y: 58 };
    private puzzleEnd: Vector = { x: 2500, y: 300 };
    private zoomed = false;
    private rafts: Raft[] = [];

    private grass: number[][] = [];
    private dirt: number[][] = [];

    private hoppers: Hopper[] = [];
    private rainbow: Vector[] = [];

    constructor(game: Game) {
        super(game);

        // eslint-disable-next-line no-sparse-arrays

        this.dude = new Dude(game, 300, 500); // outside
        // this.dude = new Dude(game, 1377, -50); // intro shed
        // this.dude = new Dude(game, 650, 200); // main house
        // this.dude = new Dude(game, 2173, 172); // river puzzle
        // this.dude = new Dude(game, 2872, -100); // milk wordle
        // this.dude = new Dude(game, -1113, 721); // other wordle
        // this.dude = new Dude(game, 996, -770); // map house

        // const rng = new SeedableRandom(123);
        // console.log(rng.randomInt(0, 100));

        this.river = new River(game);
        this.game.colliders.push(this.river);

        this.addItem(588, 200, ItemType.Unit, 'act');
        this.addItem(3115, -29, ItemType.Unit, 'act');

        this.addItem(435, 267, ItemType.Trophy, '1/1');

        this.addItem(2725, -58, 0, 'm');
        this.addItem(2725 + 50, -58, 0, 'i');
        this.addItem(2725 + 100, -58, 0, 'l');
        this.addItem(2725 + 150, -58, 0, 'k');
        this.addItem(2725 + 200, -58, 0, 'e');

        this.addItem(853, 302, ItemType.Battery);

        this.addHopSpots(-1873, 961, -2100, 1118);
        this.addHopSpots(1238, 1298, 1409, 1048);
        this.addHopSpots(2848, -685, 2641, -840);

        this.dude.controlled = true;
        this.dude.scene = this;
        this.dog = new Dog(game, 214, 510);
        this.add(this.dude, this.dog);

        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                if (Math.random() < 0.1) continue;
                const spot = [x * 200 - 5000 + random(-100, 100), y * 200 - 5000 + random(-100, 100), random(0.7, 1.2)];
                if (Math.random() < 0.9) {
                    this.grass.push(spot);
                } else {
                    this.dirt.push(spot);
                }
            }
        }

        this.moveDog();

        this.createItem(new Sign(game, 155, 490, 'Uni needs to be fastened tight.\nThe leash is adjustable from\nthe fabricator machine inside.'));
        this.createItem(new Sign(game, 1280, 239, 'This shed can be used as an emergency jail.\nKeep the key safe and away from any prisoners.'));
        this.createItem(new Sign(game, 2200, 101, 'Everything needs to cross safely!'));
        this.createItem(new Sign(game, -1937, 919, 'A well nourished mount could easily\nleap to the other side from here.'));

        this.wheat = this.addItem(2145 - 100, 60, ItemType.Wheat);
        this.chicken = this.addItem(2145 - 50, 60, ItemType.Chicken);
        this.fox = this.addItem(2145, 60, ItemType.Fox);

        this.machine = new Machine(game, 471, 70);
        this.game.colliders.push(new Collider(game, this.machine.p.x - 40, 70 - 30, 80, 30));
        this.add(this.machine);

        this.wordles.push(new Machine(game, 2802, -178));
        this.wordles.push(new Machine(game, -1243, 580));
        this.add(...this.wordles);
        this.wordles.forEach(w => this.game.colliders.push(new Collider(game, w.p.x - 40, w.p.y - 30, 80, 30)));

        this.wordles[0].makeWordle('milk', 'flip', 'e');
        this.wordles[1].makeWordle('null', 'dupe', 'h');

        this.addDoor(1376, 147, 300, 30);
        this.addDoor(-763, -73, 200, 30);

        this.rafts.push(new Raft(game, 2284 - 30, 168 - 30, -1, 0));
        this.rafts.push(new Raft(game, 44 - 30, 1304 - 30, 0, 1));
        this.rafts.push(new Raft(game, 1753 - 30, -736 - 30, 0, -1));
        this.game.platforms.push(...this.rafts);
        this.rafts[0].start();
        // this.rafts[1].start();
        // this.rafts[2].start();

        this.addTree(125, 478);

        this.addItem(844, 136, 0, 'u');
        this.addItem(891, 155, 0, 'g');
        this.addItem(313, 323, 0, 'n');
        this.addItem(1027, 189, 0, 'i');

        this.addItem(-1895, -537, 0, 'k');
        this.addItem(1101, -923, 0, 'e');
        this.addItem(900, 440, 0, 'y');

        this.addItem(1768, -745, 0, 'd').raft = this.rafts[2];
        this.addItem(33, 1319, 0, 'l').raft = this.rafts[1];

        this.addItem(-759, -137, 0, 'p');

        this.addItem(1258, 92, ItemType.Battery, 'b');
        this.addItem(1481, -28, ItemType.Key, 'k');

        this.addTree(-10, 394);
        this.addTree(-133, 324);
        this.addTree(-102, 499);
        this.addTree(-263, 385);
        this.addTree(-207, 434);

        this.addTree(100, 300);
        this.addTree(1027, 207);
        this.addTree(1090, 93);
        this.addTree(1164, 165);

        this.addTree(1621, 95);
        this.addTree(1717, 185);
        this.addTree(1800, 103);
        this.addTree(1866, 224);

        this.addTree(-2039, -568);
        this.addTree(-1896, -490);
        this.addTree(-1795, -320);
        this.addTree(-1960, -162);
        this.addTree(-1854, -62);

        this.addTree(1561, 907);
        this.addTree(1660, 849);
        this.addTree(1683, 707);
        this.addTree(1782, 772);
        this.addTree(1555, 730);
        this.addTree(1240, 1022);
        this.addTree(1309, 921);
        this.addTree(1087, 993);
        this.addTree(1155, 869);
        this.addTree(910, 982);
        this.addTree(991, 944);

        this.addTree(-1214, 1297);
        this.addTree(-499, 1078);
        this.addTree(-139, 1038);
        this.addTree(-362, 1038);
        this.addTree(-244, 990);

        this.addTree(-1996, 807);
        this.addTree(-2035, 749);
        this.addTree(-2133, 667);
        this.addTree(-1989, 610);
        this.addTree(-1913, 710);
        this.addTree(-2340, 414);
        this.addTree(-2252, 367);

        this.addTree(-932, -260);
        this.addTree(-1084, -236);
        this.addTree(-984, -170);
        this.addTree(-1210, -237);
        this.addTree(-648, -375);
        this.addTree(-541, -425);
        this.addTree(-419, -476);
        this.addTree(-332, -403);

        this.addTree(526, -625);
        this.addTree(410, -591);
        this.addTree(255, -648);
        this.addTree(301, -565);
        this.addTree(360, -484);

        this.addTree(746, -846);
        this.addTree(1232, -875);

        this.addTree(2018, -869);
        this.addTree(1925, -935);
        this.addTree(1787, -1010);
        this.addTree(1861, -1078);
        this.addTree(1981, -1078);
        this.addTree(2104, -1078);
        this.addTree(2210, -949);
        this.addTree(2379, -849);

        this.addTree(2224, -344);
        this.addTree(3571, -418);
        this.addTree(3469, -475);
        this.addTree(3547, -330);
        this.addTree(2969, -649);
        this.addTree(3056, -611);
        this.addTree(3314, -140);
        this.addTree(3383, -49);
        this.addTree(3643, 412);

        this.addTree(3355, 682);
        this.addTree(3408, 622);

        this.addTree(-267, 1325);
        this.addTree(287, 1408);
        this.addTree(173, 1402);
        this.addTree(855, 1623);
        this.addTree(419, 1716);
        this.addTree(500, 1663);
        this.addTree(-641, 1389);
        this.addTree(-717, 1436);

        this.addTree(-1794, 1996);
        this.addTree(-1934, 2014);
        this.addTree(-1868, 1952);
        this.addTree(-1542, 2284);
        this.addTree(-1437, 2258);

        this.houses.push(new House(game, 350, 50, 600, 300));
        this.houses.push(new House(game, 1227, -100, 300, 300));
        this.houses.push(new House(game, 841, -966, 300, 300));
        this.houses.push(new House(game, 2670, -198, 550, 200));
        this.houses.push(new House(game, -1389, 560, 550, 400));
        this.houses.push(new House(game, -861, -164, 200, 200));
        this.houses.push(new House(game, -565, 1339, 200, 200));
        this.houses.push(new House(game, -3108, 1340, 500, 200));

        this.houses[1].decorations.push(0);
        this.houses[6].decorations.push(1);

        this.houses.forEach(h => h.createWalls());
        this.add(...this.houses);
        this.game.colliders.push(...this.houses.flatMap(h => h.walls));

        this.game.onKeyUp(e => {
            if (e.key == 'z') this.zoomed = !this.zoomed;
            if (e.key == 'u') this.dog.locked = false;
            if (e.key == 't') {
                this.addTree(Math.round(this.dude.p.x), Math.round(this.dude.p.y), true);
            }
            if (e.key == ' ') {
                if (this.dude.riding) {
                    const hop = this.hoppers.some(h => {
                        if (h.isInside(this.dog.p)) {
                            this.rainbow.push(this.dog.p);
                            this.dog.hop(h.pair.p);
                            h.start();
                            return true;
                        }
                    });
                    if (hop) return;
                }
                const operating = distance(this.dude.p, this.machine.p) < 50;
                if (this.dude.bubble.isShown()) {
                    this.dude.bubble.setText('');
                    return;
                }
                if (this.dude.held) {
                    const pos = this.snap(offset(this.dude.p, this.dude.aim.x * 40, this.dude.aim.y * 40), this.dude.held);
                    if (operating && this.dude.held.itemType == ItemType.Battery) {
                        this.machine.addBattery();
                        this.remove(this.dude.held);
                        this.dude.held = null;
                        this.dude.carry(false);
                        return;
                    }
                    if (operating && this.dude.held.itemType == ItemType.Unit) {
                        this.machine.addActModule();
                        this.remove(this.dude.held);
                        this.dude.held = null;
                        this.dude.carry(false);
                        return;
                    }
                    if (this.dude.collides(pos)) {
                        return;
                    }
                    if (distance(pos, this.dog.p) < 50 && !this.dog.held) {
                        this.dog.held = this.dude.held;
                        this.dog.held.shadowShown = false;
                    } else {
                        this.dude.held.drop(pos);
                    }
                    this.dude.held = null;
                    this.dude.carry(false);
                    this.machine.evaluate();
                    this.wordles.forEach(w => w.evaluateWordle(this));
                    this.checkPuzzle();
                    return;
                }
                const closest = this.items.reduce((a, b) => {
                    return distance(this.dude.p, a.p) < distance(this.dude.p, b.p) ? a : b;
                });
                if (distance(this.dude.p, this.dog.p) < 50 && !this.dog.held && !this.dog.locked) {
                    if (!this.dude.riding) {
                        this.dude.hop(offset(this.dog.p, 0, -40));
                    }
                    this.dog.lockFor();
                    this.dude.riding = !this.dude.riding;
                    this.dog.riding = !this.dog.riding;
                    this.dude.shadowShown = !this.dude.shadowShown;
                    this.dude.dismount();
                    this.dude.mount = this.dude.riding ? this.dog : null;
                    return;
                }
                if (distance(closest.p, this.dude.p) > 50) {
                    if (operating && !this.dude.held) {
                        this.machine.operate(this);
                        return;
                    }
                    return;
                }
                if (this.dog.held == closest) {
                    this.dog.held = null;
                }
                if (closest.locked) {
                    closest.act(this.dude);
                    return;
                }
                if (closest.raft) {
                    closest.raft.start();
                    closest.raft = null;
                }
                this.machine.remove(closest);
                this.wordles.forEach(w => w.remove(closest));
                this.dude.held = closest;
                closest.held = true;
                closest.shadowShown = false;
                this.dude.carry(true);
                this.machine.evaluate();
                this.wordles.forEach(w => w.evaluateWordle(this));
                this.checkPuzzle();
            }
        });
    }

    private addDoor(x: number, y: number, w: number, h: number) {
        const door = new Collider(this.game, x - w / 2, y - h / 2, w + 2, h);
        door.d = door.p.y;
        door.door = true;
        this.game.colliders.push(door);
        this.add(door);
    }

    private addHopSpots(x1: number, y1: number, x2: number, y2: number): void {
        const spot1 = new Hopper(this.game, x1, y1, 50, 20);
        const spot2 = new Hopper(this.game, x2, y2, 50, 20);
        spot1.pair = spot2;
        spot2.pair = spot1;
        this.add(spot1, spot2);
        this.hoppers.push(spot1, spot2);
    }

    private snap(pos: Vector, item: Item): Vector {
        let p = pos;
        [this.machine, ...this.wordles].forEach(m => p = m.snap(p, item));
        return p;
    }

    public free(): void {
        if (this.dog.locked) this.dog.p = { x: 650, y: 363 };
        this.dog.locked = false;
    }

    public remove(item: Entity): void {
        this.removeChild(item);
        this.items = this.items.filter(i => i !== item);
        this.game.colliders = this.game.colliders.filter(c => c !== item);
    }

    private moveDog(): void {
        this.dog.target = offset(this.tree, random(-150, 150), random(0, 100));
        setTimeout(() => this.moveDog(), random(1000, 3000));
    }

    private addTree(x: number, y: number, log: boolean = false): void {
        if (log) {
            const msg = `this.addTree(${x}, ${y});`;
            console.log(msg);
            navigator.clipboard.writeText(msg);
        }
        this.add(new Tree(this.game, x, y, 0, 0));
    }

    private createItem(item: Item): void {
        this.items.push(item);
        this.add(item);
    }

    public colorize(item?: Item, color?: string): void {
        const options = [COLORS.red, COLORS.shadow, COLORS.green, COLORS.yellow, COLORS.skin, COLORS.brown, COLORS.purple];
        color = color ?? options[randomInt(0, options.length - 1)];
        if (item) {
            item.colorize(color);
        }
        else {
            this.dude.skin = color;
        }
    }

    public addItem(x: number, y: number, itemType: number, letter?: string): Item {
        const item = new Item(this.game, x, y, itemType, letter);
        this.createItem(item);
        return item;
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.river.update(tick, mouse);
        this.rafts.forEach(r => {
            r.update(tick, mouse);
            r.move([this.dude, this.dog]);
        });
        if (distance(this.dog.target, this.dude.p) > 60 && !this.dog.locked) {
            this.dog.target = this.dude.p;
        }
        if (this.dude.mount) {
            this.dude.moveWithMount();
        }
        if (this.rainbow.length > 0 && Math.random() < 0.5) {
            this.rainbow = this.rainbow.slice(1);
        }
        if (this.dog.dashing) {
            this.rainbow.push(offset(this.dog.p, 0, this.dog.getHopOffset() - 10));
        }
    }

    checkPuzzle(): void {
        if (this.puzzleCompleted) return;

        const getPos = (item: Entity): number => {
            if (distance(item.p, this.puzzleStart) < 80) return 1;
            if (distance(item.p, this.puzzleEnd) < 80) return 2;
            return 0;
        };

        const cp = getPos(this.chicken);
        const fp = getPos(this.fox);
        const wp = getPos(this.wheat);
        const pp = getPos(this.dude);

        if (cp == 2 && fp == 2 && wp == 2) {
            this.puzzleCompleted = true;

            setTimeout(() => {
                this.addItem(this.chicken.p.x, this.chicken.p.y, 0, 'c');
                this.addItem(this.fox.p.x, this.fox.p.y, 0, 'f');
                this.addItem(this.wheat.p.x, this.wheat.p.y, 0, 'w');
                this.remove(this.chicken);
                this.remove(this.fox);
                this.remove(this.wheat);
            }, 200);
            return;
        }

        if (cp == 0 || fp == 0 || wp == 0 || (cp == fp && fp != pp) || (cp == wp && wp != pp)) {
            setTimeout(() => {
                if (!this.chicken.held) this.chicken.reset();
                if (!this.fox.held) this.fox.reset();
                if (!this.wheat.held) this.wheat.reset();
            }, 200);
            return;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLORS.green;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.fillRect(-100, -100, ctx.canvas.width + 200, ctx.canvas.height + 200);

        ctx.translate(ctx.canvas.width * 0.25, ctx.canvas.height * 0.25);
        // if (this.zoomed) ctx.scale(0.25, 0.25);
        if (this.zoomed) ctx.scale(0.1, 0.1);
        ctx.translate(-this.dude.p.x, -this.dude.p.y + 20);

        const wasInside = this.inside;
        this.inside = null;

        this.houses.forEach(h => {
            h.entered = false;
            if (h.isInside(this.dude.p, 10)) {
                this.inside = h;
                h.entered = true;
            }
        });

        if (!this.dog.locked) {
            const pp = this.dude.p;

            if (!wasInside && this.inside && !this.dude.riding) {
                setTimeout(() => this.dog.p = offset(pp, 0, 100), 500);
            }

            if (wasInside && !this.inside && !this.dude.riding) {
                setTimeout(() => this.dog.p = offset(pp, 0, 20), 500);
            }
        }

        ctx.beginPath();
        ctx.fillStyle = COLORS.shadow;
        ctx.strokeStyle = COLORS.shadow;
        ctx.lineWidth = 3;
        this.grass.forEach(g => {
            ctx.moveTo(g[0], g[1]);
            ctx.ellipse(g[0], g[1], 6 * g[2], 2 * g[2], 0, 0, 2 * Math.PI);
            ctx.moveTo(g[0], g[1]);
            ctx.lineTo(g[0] + this.animationPhase * 2, g[1] - 13 * g[2]);
            ctx.moveTo(g[0] - 3, g[1]);
            ctx.lineTo(g[0] + this.animationPhase * 2 - 6, g[1] - 10 * g[2]);
            ctx.moveTo(g[0] + 3, g[1]);
            ctx.lineTo(g[0] + this.animationPhase * 2 + 6, g[1] - 10 * g[2]);
        });
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = COLORS.yellow;
        ctx.strokeStyle = COLORS.yellow;
        ctx.lineWidth = 30;
        ctx.setLineDash([0, 20]);
        this.dirt.forEach(g => {
            ctx.moveTo(g[0], g[1]);
            ctx.ellipse(g[0], g[1], 80 * g[2], 20 * g[2], 0, 0, 2 * Math.PI);
        });
        ctx.fill();
        ctx.stroke();

        this.river.draw(ctx);
        this.inside?.drawInterior(ctx);

        if (this.rainbow.length > 0) {
            ctx.lineCap = 'butt';
            ctx.beginPath();
            ctx.moveTo(this.rainbow[0].x, this.rainbow[0].y);
            this.rainbow.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineWidth = 40;
            ctx.strokeStyle = COLORS.red;
            ctx.stroke();
            ctx.lineWidth = 30;
            ctx.strokeStyle = COLORS.gray;
            ctx.stroke();
            ctx.lineWidth = 20;
            ctx.strokeStyle = COLORS.shadow;
            ctx.stroke();
            ctx.lineWidth = 10;
            ctx.strokeStyle = COLORS.yellow;
            ctx.stroke();
            ctx.lineCap = 'round';
        }

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ffffff66';
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.ellipse(this.puzzleStart.x, this.puzzleStart.y, 80, 60, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.puzzleEnd.x, this.puzzleEnd.y, 80, 60, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        this.rafts.forEach(r => r.draw(ctx));

        ctx.beginPath();
        for (const item of this.getChildren()) {
            if (!(item as Shadowed)?.shadowShown) continue;
            ctx.fillStyle = '#00000022';
            ctx.moveTo(item.p.x, item.p.y);
            ctx.ellipse(item.p.x, item.p.y + 1, (item as Shadowed)?.shadowWidth, 8, 0, 0, 2 * Math.PI);
        }
        ctx.fill();

        ctx.strokeStyle = '#000';

        if (this.dog.locked) {
            ctx.beginPath();
            const mid = {
                x: (this.tree.x + this.dog.p.x) / 2 + this.animationPhase * 5,
                y: (this.tree.y + this.dog.p.y) / 2 + 20 + this.animationPhaseAbs * 5
            };
            ctx.moveTo(this.tree.x, this.tree.y - 10);
            ctx.quadraticCurveTo(mid.x, mid.y, this.dog.p.x, this.dog.p.y - 20);
            ctx.lineWidth = 7;
            ctx.stroke();
            ctx.strokeStyle = COLORS.red;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        super.draw(ctx);
        this.inside?.drawExterior(ctx);
    }
}
