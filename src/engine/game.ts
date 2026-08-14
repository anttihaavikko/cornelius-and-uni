import { AudioManager } from './audio';
import { Blinders } from './blinders';
import { Camera } from './camera';
import { Container } from './container';
import { Entity } from './entity';
import { Mouse } from './mouse';
// import { Pitcher } from './pitcher';

export class Game extends Entity {
    // public pitcher: Pitcher;
    public scene: Container;
    public camera = new Camera();
    public usingPad: boolean;
    public usingTouch: boolean;
    public held = {};
    public colliders: Entity[] = [];

    private keyDownListeners: ((event: KeyboardEvent) => void)[] = [];
    private keyUpListeners: ((event: KeyboardEvent) => void)[] = [];
    private blinders: Blinders;
    private curMouse: Mouse;

    constructor(public audio: AudioManager, public canvas: HTMLCanvasElement) {
        super(null, 0, 0, 0, 0);
        // this.pitcher = new Pitcher(audio);
        this.blinders = new Blinders(this, 400);
    }

    public pressed(event: KeyboardEvent): void {
        if (event.repeat) return;
        this.keyDownListeners.forEach(k => k(event));
    }

    public released(event: KeyboardEvent): void {
        this.keyUpListeners.forEach(k => k(event));
    }

    public onKeyDown(callback: (event: KeyboardEvent) => void): void {
        this.keyDownListeners.push(callback);
    }

    public onKeyUp(callback: (event: KeyboardEvent) => void): void {
        this.keyUpListeners.push(callback);
    }

    public clearKeyListeners(): void {
        this.keyDownListeners = [];
        this.keyUpListeners = [];
    }

    public click(mouse: Mouse, touch: boolean = false): void {
        this.usingPad = false;
        if (!touch) return;
        this.scene?.getButtons().forEach(b => {
            if (b.visible && b.isInside(mouse)) b.trigger();
        });
    }

    public getMouse(): Mouse {
        return this.curMouse;
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.scene?.update(tick, mouse);
        this.camera.update();
        this.blinders.update(tick, mouse);
        // this.pitcher.update(this.delta);
        mouse.pressing = false;
        this.curMouse = { ...mouse };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.scene?.getBgColor();
        ctx.fillRect(0, 0, 800, 600);
        ctx.save();
        ctx.rotate(this.camera.rotation);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(this.camera.offset.x - this.camera.pan.x + this.camera.shift, this.camera.offset.y + this.camera.pan.y);
        this.scene?.draw(ctx);
        ctx.restore();
        this.blinders.draw(ctx);
    }

    public changeScene(scene: Container): void {
        this.blinders.close(() => {
            this.scene?.end();
            this.scene = scene;
            scene.ratioChanged(window.innerHeight > window.innerWidth);
            this.blinders.open();
        });
    }

    public getBlinders(): Blinders {
        return this.blinders;
    }
}
