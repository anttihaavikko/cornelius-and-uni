import { COLORS } from './colors';
import { Dog } from './dog';
import { Dude } from './dude';
import { Container } from './engine/container';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';

export class Scene extends Container {

    private dude: Dude;
    private dog: Dog;

    constructor(game: Game) {
        super(game);
        this.dude = new Dude(game, 100, 100);
        this.dude.controlled = true;
        this.dog = new Dog(game, 200, 200);
        this.add(this.dude, this.dog);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.dog.target = this.dude.p;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(-100, -100, ctx.canvas.width + 200, ctx.canvas.height + 200);
        super.draw(ctx);
    }
}
