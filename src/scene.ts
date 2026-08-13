import { COLORS } from './colors';
import { Dog } from './dog';
import { Dude } from './dude';
import { Container } from './engine/container';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { distance, offset } from './engine/vector';
import { House } from './house';
import { Item } from './item';
import { Tree } from './tree';

export class Scene extends Container {

    private dude: Dude;
    private dog: Dog;
    private items: Item[] = [];
    private houses: House[] = [];

    constructor(game: Game) {
        super(game);
        this.dude = new Dude(game, 400, 200);
        this.dude.controlled = true;
        this.dog = new Dog(game, 0, 200);
        this.add(this.dude, this.dog);

        this.addItem(50, 50);
        this.addItem(100, 50);
        this.addItem(150, 50);

        this.add(new Tree(game, 100, 300, 50, 100));

        this.houses.push(new House(game, 550, 100, 400, 200));
        this.houses.forEach(h => h.createWalls());
        this.add(...this.houses);
        this.game.colliders.push(...this.houses.flatMap(h => h.walls));

        this.game.onKeyUp(e => {
            if (e.key == ' ') {
                if (this.dude.held) {
                    const pos = offset(this.dude.p, this.dude.aim.x * 40, this.dude.aim.y * 40);
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
        this.dog.target = this.dude.p;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLORS.green;
        ctx.fillRect(-100, -100, ctx.canvas.width + 200, ctx.canvas.height + 200);

        ctx.translate(-this.dude.p.x + ctx.canvas.width * 0.25, -this.dude.p.y + 20 + ctx.canvas.height * 0.25)

        let inside = null;
        this.houses.forEach(h => {
            h.entered = false;
            if (h.isInside(this.dude.p, 10)) {
                inside = h;
                h.entered = true;
            }
        });

        inside?.drawInterior(ctx);

        for (const item of this.getChildren()) {
            if (!item['shadowShown']) continue;
            ctx.fillStyle = inside ? '#435667' : COLORS.shadow;
            ctx.beginPath();
            ctx.ellipse(item.p.x, item.p.y + 1, item['shadowWidth'], 8, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        super.draw(ctx);
        inside?.drawExterior(ctx);
    }
}
