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
        this.dude = new Dude(game, 400, 200);
        this.dude.controlled = true;
        this.dog = new Dog(game, 0, 200);
        this.add(this.dude, this.dog);

        this.addItem(50, 50);
        this.addItem(100, 50);
        this.addItem(150, 50);

        this.add(new Tree(game, 100, 300, 0, 0));
        this.add(new Tree(game, 1027, 207, 0, 0));
        this.add(new Tree(game, 1090, 93, 0, 0));
        this.add(new Tree(game, 1169, 165, 0, 0));

        this.text = new TextEntity(game, '', 16, 0, 0, -1, ZERO, { shadow: 1.5 });
        this.add(this.text);

        this.houses.push(new House(game, 550, 100, 400, 200));
        this.houses.forEach(h => h.createWalls());
        this.add(...this.houses);
        this.game.colliders.push(...this.houses.flatMap(h => h.walls));

        this.game.onKeyUp(e => {
            if (e.key == ' ') {
                this.text.content = `(${Math.round(this.dude.p.x)}, ${Math.round(this.dude.p.y)})`;
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

    private addItem(x: number, y: number): void {
        const item = new Item(this.game, x, y);
        this.items.push(item);
        this.add(item);
    }

    update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        if (distance(this.dog.target, this.dude.p) > 60) {
            this.dog.target = this.dude.p;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLORS.green;
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

        if (!wasInside && this.inside) {
            this.dog.p = offset(this.dude.p, 0, 100);
        }

        if (wasInside && !this.inside) {
            this.dog.p = offset(this.dude.p, 0, -50);
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
