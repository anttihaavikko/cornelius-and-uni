import { SteamPad } from './steam-pad';

export class Pad {
    public steam = new SteamPad();
    
    private current: boolean[][] = [];
    private previous: boolean[][] = [];
    private locked: boolean;
    private cooldown: boolean;

    public update(): void {
        this.previous = [...this.current];
        this.current = this.mapped().map(pad => pad?.buttons.map(b => b.pressed || b.touched));
        // console.log(navigator.getGamepads().length, this.current?.some(v => v?.some(val => val)));
    }

    public isConnected(): boolean {
        return this.mapped().some(pad => pad);
    }

    public lock(): void {
        this.locked = true;
        setTimeout(() => this.locked = false, 100);
    }

    public isDown(index: PadButton): boolean {
        if (this.locked || this.current.length === 0 || this.current.every(c => !c || c.length === 0)) return false;
        return this.current.some((cur, i) => cur && cur[index] && (!this.previous[i] || !this.previous[i][index]));
    }

    public getHorizontal(): number {
        return this.mapped().reduce((sum, pad, i) => sum + this.getHorizontalFor(pad, i), 0);
    }

    public getVertical(): number {
        return this.mapped().reduce((sum, pad, i) => sum + this.getVerticalFor(pad, i), 0);
    }

    private mapped(): Gamepad[] {
        return [
            ...navigator.getGamepads(),
            this.steam.getAsGamepad()
        ];
    }

    private isDownFor(pad: Gamepad, index: number, button: number): boolean {
        if (!pad || !pad.buttons[button]) return false;
        return pad.buttons[button].pressed && (!this.previous[index] || !this.previous[index][button]);
    }

    private getVerticalFor(pad: Gamepad, index: number): number {
        if (!pad || this.cooldown) return 0;
        const total = (this.isDownFor(pad, index, PadButton.DOWN) ? -1 : 0) + (this.isDownFor(pad, index, PadButton.UP) ? 1 : 0) - pad.axes[1];
        if (Math.abs(pad.axes[1]) > 0.5) {
            this.cooldown = true;
            setTimeout(() => this.cooldown = false, 250);
        }
        return total;
    }

    private getHorizontalFor(pad: Gamepad, index: number): number {
        if (!pad || this.cooldown) return 0;
        const total = (this.isDownFor(pad, index, PadButton.LEFT) ? -1 : 0) + (this.isDownFor(pad, index, PadButton.RIGHT) ? 1 : 0) + pad.axes[0];
        if (Math.abs(pad.axes[0]) > 0.5) {
            this.cooldown = true;
            setTimeout(() => this.cooldown = false, 250);
        }
        return total;
    }
}

export enum PadButton {
    NONE = -1,
    A = 0,
    B = 1,
    X = 2,
    Y = 3,
    LB = 4,
    RB = 5,
    LT = 6,
    RT = 7,
    SELECT = 8,
    START = 9,
    LS = 10,
    RS = 11,
    UP = 12,
    DOWN = 13,
    LEFT = 14,
    RIGHT = 15,
    HOME = 16
}