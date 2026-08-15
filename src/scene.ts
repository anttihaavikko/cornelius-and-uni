import { Collider } from './collider';
import { COLORS } from './colors';
import { Dog } from './dog';
import { Dude } from './dude';
import { Container } from './engine/container';
import { Entity } from './engine/entity';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { random } from './engine/random';
import { distance, offset, Vector } from './engine/vector';
import { House } from './house';
import { Item, ItemType } from './item';
import { Machine } from './machine';
import { Raft } from './raft';
import { River } from './river';
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
    private river: River;

    private chicken: Item;
    private fox: Item;
    private wheat: Item;
    private puzzleCompleted = false;

    private puzzleStart: Vector = { x: 2097, y: 58 };
    private puzzleEnd: Vector = { x: 2500, y: 300 };
    private zoomed = false;
    private rafts: Raft[] = [];

    constructor(game: Game) {
        super(game);

        // eslint-disable-next-line no-sparse-arrays

        // this.dude = new Dude(game, 300, 500); // outside
        // this.dude = new Dude(game, 1377, -50); // intro shed
        this.dude = new Dude(game, 650, 200); // main house
        // this.dude = new Dude(game, 2173, 172); // river puzzle

        this.river = new River(game);
        this.game.colliders.push(this.river);

        this.addItem(588, 200, ItemType.Unit, 'act');

        this.addItem(853, 302, ItemType.Battery);

        this.dude.controlled = true;
        this.dude.scene = this;
        this.dog = new Dog(game, 214, 510);
        this.add(this.dude, this.dog);

        this.moveDog();

        this.createItem(new Sign(game, 155, 490, 'Uni needs to be fastened tight.\nThe leash is adjustable from\nthe fabricator machine inside.'));
        this.createItem(new Sign(game, 1280, 239, 'This shed can be used as an emergency jail.\nKeep the key safe and away from any prisoners.'));
        this.createItem(new Sign(game, 2200, 101, 'Everything needs to cross safely!'));

        this.wheat = this.addItem(2145 - 100, 60, ItemType.Wheat);
        this.chicken = this.addItem(2145 - 50, 60, ItemType.Chicken);
        this.fox = this.addItem(2145, 60, ItemType.Fox);

        this.machine = new Machine(game, 471, 70);
        this.game.colliders.push(new Collider(game, this.machine.p.x - 40, 70 - 30, 80, 30));
        this.add(this.machine);

        const door = new Collider(game, 1376 - 150, 147 - 15, 302, 30);
        door.door = true;
        this.game.colliders.push(door);
        this.add(door);

        this.rafts.push(new Raft(game, 2284 - 30, 168 - 30, 60, 60));
        this.game.platforms.push(...this.rafts);

        this.addTree(125, 478);

        this.addItem(844, 136, 0, 'u');
        this.addItem(891, 155, 0, 'g');
        this.addItem(313, 323, 0, 'n');
        this.addItem(1027, 189, 0, 'i');

        this.addItem(800, 440, 0, 'k');
        this.addItem(850, 440, 0, 'e');
        this.addItem(900, 440, 0, 'y');

        this.addItem(950, 440, 0, 'd');
        this.addItem(1000, 440, 0, 'p');
        this.addItem(1050, 440, 0, 'l');

        this.addItem(1258, 92, ItemType.Battery, 'b');
        this.addItem(1481, -28, ItemType.Key, 'k');

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

        this.houses.push(new House(game, 350, 50, 600, 300));
        this.houses.push(new House(game, 1227, -100, 300, 300));
        this.houses.push(new House(game, 841, -966, 300, 300));

        this.houses[1].decorations.push(0);

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
                const operating = distance(this.dude.p, this.machine.p) < 50;
                if (this.dude.bubble.isShown()) {
                    this.dude.bubble.setText('');
                    return;
                }
                if (this.dude.held) {
                    const pos = this.machine.snap(offset(this.dude.p, this.dude.aim.x * 40, this.dude.aim.y * 40), this.dude.held);
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
                this.machine.remove(closest);
                this.dude.held = closest;
                closest.held = true;
                closest.shadowShown = false;
                this.dude.carry(true);
                this.machine.evaluate();
                this.checkPuzzle();
            }
        });
    }

    public createPackage(pos: Vector, text: string): void {
        this.addItem(pos.x, pos.y, ItemType.Package, text);
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

    public colorize(): void {
        this.dude.skin = 'pink';
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
        if (this.zoomed) ctx.scale(0.25, 0.25);
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

        this.river.draw(ctx);
        this.inside?.drawInterior(ctx);

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
            if (!item['shadowShown']) continue;
            ctx.fillStyle = '#00000022';
            ctx.moveTo(item.p.x, item.p.y);
            ctx.ellipse(item.p.x, item.p.y + 1, item['shadowWidth'], 8, 0, 0, 2 * Math.PI);
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
