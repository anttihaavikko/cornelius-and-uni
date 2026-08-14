import { COLORS } from './colors';
import { Dog } from './dog';
import { Dude } from './dude';
import { Container } from './engine/container';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { TextEntity } from './engine/text';
import { distance, offset, ZERO } from './engine/vector';
import { House } from './house';
import { Item } from './item';
import { Tree } from './tree';

export class Scene extends Container {
    private dude: Dude;
    private dog: Dog;
    private items: Item[] = [];
    private houses: House[] = [];
    private text: TextEntity;
    private inside: House;

    constructor(game: Game) {
        super(game);
        this.dude = new Dude(game, 1377, 0); // intro shed
        // this.dude = new Dude(game, 650, 200); // main house
        this.dude.controlled = true;
        this.dog = new Dog(game, 0, 200);
        this.add(this.dude, this.dog);

        this.addTree(125, 478);

        this.addItem(150, 50, 0, 'u');
        this.addItem(200, 50, 0, 'n');
        this.addItem(250, 50, 0, 'i');

        this.addTree(100, 300);
        this.addTree(1027, 207);
        this.addTree(1090, 93);
        this.addTree(1169, 165);

        this.addTree(1621, 95);
        this.addTree(1717, 185);
        this.addTree(1800, 103);
        this.addTree(1866, 224);

        this.text = new TextEntity(game, '', 16, 0, 0, -1, ZERO, { shadow: 1.5 });
        this.add(this.text);

        this.houses.push(new House(game, 350, 50, 600, 300));
        this.houses.push(new House(game, 1227, -100, 300, 300));
        this.houses.forEach(h => h.createWalls());
        this.add(...this.houses);
        this.game.colliders.push(...this.houses.flatMap(h => h.walls));

        this.game.onKeyUp(e => {
            if (e.key == 't') {
                this.addTree(Math.round(this.dude.p.x), Math.round(this.dude.p.y), true);
            }
            if (e.key == ' ') {
                // this.text.content = `(${Math.round(this.dude.p.x)}, ${Math.round(this.dude.p.y)})`;
                this.text.p = offset(this.dude.p, 0, -70);
                this.text.d = this.dude.d + 10;
                if (this.dude.held) {
                    const pos = offset(this.dude.p, this.dude.aim.x * 40, this.dude.aim.y * 40);
                    if (this.game.colliders.some(c => c.isInside(pos, 20))) {
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
                    return;
                }
                const closest = this.items.reduce((a, b) => {
                    return distance(this.dude.p, a.p) < distance(this.dude.p, b.p) ? a : b;
                });
                if (distance(this.dude.p, this.dog.p) < 50 && !this.dog.held) {
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
                if (distance(closest.p, this.dude.p) > 50) return;
                if (this.dog.held == closest) {
                    this.dog.held = null;
                }
                this.dude.held = closest;
                closest.held = true;
                closest.shadowShown = false;
                this.dude.carry(true);
            }
        })
    }

    private addTree(x: number, y: number, log: boolean = false): void {
        if (log) {
            const msg = `this.addTree(${x}, ${y});`;
            console.log(msg);
            navigator.clipboard.writeText(msg);
        }
        this.add(new Tree(this.game, x, y, 0, 0));
    }

    private addItem(x: number, y: number, itemType: number, letter?: string): void {
        const item = new Item(this.game, x, y, itemType, letter);
        this.items.push(item);
        this.add(item);
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        if (distance(this.dog.target, this.dude.p) > 60) {
            this.dog.target = this.dude.p;
        }
        if (this.dude.mount) {
            this.dude.moveWithMount();
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLORS.green;
        ctx.lineJoin = 'round';
        ctx.fillRect(-100, -100, ctx.canvas.width + 200, ctx.canvas.height + 200);

        ctx.translate(-this.dude.p.x + ctx.canvas.width * 0.25, -this.dude.p.y + 20 + ctx.canvas.height * 0.25)

        const wasInside = this.inside;
        this.inside = null;

        this.houses.forEach(h => {
            h.entered = false;
            if (h.isInside(this.dude.p, 10)) {
                this.inside = h;
                h.entered = true;
            }
        });

        const pp = this.dude.p;

        if (!wasInside && this.inside && !this.dude.riding) {
            setTimeout(() => this.dog.p = offset(pp, 0, 100), 500);
        }

        if (wasInside && !this.inside && !this.dude.riding) {
            setTimeout(() => this.dog.p = offset(pp, 0, 20), 500);
        }

        this.inside?.drawInterior(ctx);

        ctx.beginPath();
        for (const item of this.getChildren()) {
            if (!item['shadowShown']) continue;
            ctx.fillStyle = '#00000022';
            ctx.moveTo(item.p.x, item.p.y);
            ctx.ellipse(item.p.x, item.p.y + 1, item['shadowWidth'], 8, 0, 0, 2 * Math.PI);
        }
        ctx.fill();

        super.draw(ctx);
        this.inside?.drawExterior(ctx);
    }
}
