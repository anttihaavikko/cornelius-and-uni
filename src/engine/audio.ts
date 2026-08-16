/* eslint-disable no-sparse-arrays */
import { song } from '../song';
// import { zzfx } from './zzfx';
import { zzfx, zzfxM, zzfxP } from './zzfxm';

export class AudioManager {
    private soundVolume = 1;
    private buffer: unknown[];
    private playing: boolean;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.buffer = zzfxM(song[0] as any, song[1] as any, song[2] as any, song[3] as any);
    }

    public playMusic(): void {
        if (this.playing) return;
        const node = zzfxP(...this.buffer);
        node.loop = true;
        this.playing = true;
    }

    public play(values: number[]): void {
        // if (this.soundsMuted) return;
        zzfx(...values.map((v, i) => i === 0 ? (v ?? 1) * 0.6 * this.soundVolume : v));
    }

    // public button(): void {
    // }

    // public buttonHover(): void {
    // }

    public step(vol: number): void {
        this.play([0.3 * vol, , 232, , .04, .02, , 3.1, -20, , , , , , 5.1, , , .94, .02, , -1332]);
    }

    public stepInside(vol: number): void {
        this.play([4 * vol, , 76, , , .02, , 1.5, , , , , .16, , 126, , .42, .58, .01, .49]);
    }

    public jump(): void {
        this.play([, , 323, .03, .01, .07, , 2.6, , 80, , , , , , , , .89, .03]);
    }

    public pick(): void {
        this.play([0.6, , 218, .03, .04, .08, , 1.8, 41, 120, , , , , , , , .57, .05]);
        // [,,130,,,.04,1,2.8,28,,139,.66,,,,,,.94,.02]
    }

    public drop(): void {
        this.play([.6, , 403, .04, .05, .09, 1, , , -17, , , , , , , , .59, .03, , 112]);
    }

    public beep(): void {
        this.play([1.1, , 662, .03, .07, .19, 1, 2.5, , , 442, .1, , , , .1, , .58, .01]);
    }

    public boot(): void {
        this.play([.5, , 273, .05, .14, .38, , 1.7, , , 375, .17, , , , , , , .17, , 154]);
    }

    public bad(): void {
        // this.play([.5, , 424, .07, .16, .06, 5, .8763403187270514, , -3, -135, .16, .07, , .7, , , .88, .23, , 979]);
        this.play([2, , 98, .06, .21, .53, 2, 3.8, , -9, , , , .7, , .7, , .49, .1]);
    }

    public talk(): void {
        this.play([0.7, , 469, , , .06, 1, 1.5, 4, -5, , , , , , , , .61, .03]);
    }

    public bubble(): void {
        this.play([0.8, , 321, .01, .13, .09, 1, .6, -2, -35, , , , , , .1, , .64, .09]);
    }

    public house(): void {
        this.play([.5, , 176, .37, .01, .01, 1, 0, 10, -21, , , .09, , 11, , .07, .84, .01, .02, 735]);
    }
}
