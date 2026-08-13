import { COLORS } from './colors';
import { Dog } from './dog';
import { Dude } from './dude';
import { Container } from './engine/container';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { distance, offset } from './engine/vector';
import { Item } from './item';

export class Scene extends Container {

    private dude: Dude;
    private dog: Dog;
    private items: Item[] = [];

    constructor(game: Game) {
        super(game);
        this.dude = new Dude(game, 400, 200);
        this.dude.controlled = true;
        this.dog = new Dog(game, 0, 200);
        this.add(this.dude, this.dog);

        this.addItem(50, 50);
        this.addItem(100, 50);
        this.addItem(150, 50);

        this.game.onKeyUp(e => {
            if (e.key == ' ') {
                if (this.dude.held) {
                    this.dude.held.drop(offset(this.dude.p, this.dude.aim.x * 40, this.dude.aim.y * 40));
                    this.dude.held = null;
                    this.dude.carry(false);
                    return;
                }
                const closest = this.items.reduce((a, b) => {
                    return distance(this.dude.p, a.p) < distance(this.dude.p, b.p) ? a : b;
                });
                if (distance(closest.p, this.dude.p) > 50) return;
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

        for (const item of this.getChildren()) {
            if (!item['shadowShown']) continue;
            ctx.fillStyle = COLORS.shadow;
            ctx.beginPath();
            ctx.ellipse(item.p.x, item.p.y + 1, item['shadowWidth'], 8, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        super.draw(ctx);
    }
}
