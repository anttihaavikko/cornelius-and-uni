import { PadButton } from './pad';

const keys = [
    [' ', 'Enter'],
    ['e'],
    ['r'],
    ['f'],
    ['WheelDown'],
    ['WheelUp'],
    ['Home'],
    ['End', 'Backspace'],
    ['Tab'],
    ['Escape'],
    ['ls'],
    ['rs'],
    ['1', 'ArrowUp'],
    ['3', 'ArrowDown'],
    ['4', 'ArrowLeft'],
    ['2', 'ArrowRight'],
    ['HomeButton']
];

export class SteamPad {
    private keyStates = {};
    private x: number = 0;
    private y: number = 0;

    public press(key: string): void {
        if (key === 'w') this.y = -1;
        if (key === 's') this.y = 1;
        if (key === 'a') this.x = -1;
        if (key === 'd') this.x = 1;
        this.keyStates[key] = true;
    }

    public release(key: string): void {
        if (key === 'w' || key === 's') this.y = 0;
        if (key === 'a' || key === 'd') this.x = 0;
        this.keyStates[key] = false;
    }

    public get(button: PadButton): boolean {
        return keys[button].some(k => this.keyStates[k]);
    }

    public getAsGamepad(): Gamepad {
        return {
            buttons: keys.map(key => ({ pressed: key.some(k => this.keyStates[k]) } as GamepadButton)),
            axes: [this.x, this.y] as ReadonlyArray<number>
        } as unknown as Gamepad;
    }
}