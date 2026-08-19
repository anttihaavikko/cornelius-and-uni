import { Entity } from './engine/entity';
import { Game } from './engine/game';
import { lerp } from './engine/math';
import { distance, Vector } from './engine/vector';

export class River extends Entity {
    private time = 0;
    private points: number[][][] = [
        [
            [-160, -760],
            [-780, -480, 1],
            [-1560, -280, 1],
            [-1760, -780, 1],
            [-2180, -780, 1],
            [-2100, 0, 1],
            [-2500, 400],
            [-1980, 1040, 1],
            [-1220, 1400, 1],
            [-280, 1120, 1],
            [220, 1300, 1],
            [800, 1080],
            [1460, 1180, 1],
            [1940, 800],
            [2380, 180, 1],
            [2000, -540],
            [1420, -820, 1],
            [1240, -1120, 1],
            [780, -1120, 1],
            [540, -760, 1],
            [-60, -760],
        ],
        [
            [2020, 760],
            [2520, 640],
            [2920, 760],
            [3380, 480, 1],
            [3720, 540],
            [3880, 180],
            [3660, -180],
            [3740, -520],
            [3220, -720],
            [2800, -820],
            [2540, -600, 1],
            [2300, -460],
            [2000, -520],
        ],
        [
            [2800, -860],
            [2640, -1160],
            [2240, -1480],
            [1800, -1400],
            [1260, -1140, 1],
        ],
        [
            [-2520, 440],
            [-2680, 800, 1],
            [-3080, 1020, 1],
            [-3460, 1200],
            [-3320, 1700, 4],
            [-3420, 2000],
            [-3100, 2100, 1],
            [-2700, 2060, 1],
            [-2400, 2220],
            [-1860, 2100],
            [-1480, 2140],
            [-1100, 2000],
            [-800, 2140],
            [-420, 1940, 1],
            [-40, 1780],
            [440, 1840],
            [700, 1700],
            [700, 1560],
            [840, 1460, 1],
            [1040, 1500, 1],
            [1300, 1460, 1],
            [1460, 1240, 1],
        ]
    ];

    constructor(game: Game) {
        super(game, 0, 0, 0, 0);
    }

    public allPoints(): number[][] {
        return this.points.flatMap(p => p);
    }

    public isInside(point: Vector): boolean {
        for (let i = 0; i < this.points.length; i++) {
            const s = this.points[i];
            let prev = s[0];
            for (const p of s.slice(1)) {
                const segments = distance(this.toVector(p), this.toVector(prev)) / 50;
                for (let i = 0; i <= 1; i += 1 / segments) {
                    const pp: Vector = {
                        x: lerp(prev[0], p[0], i),
                        y: lerp(prev[1], p[1], i)
                    };
                    if (distance(point, pp) < 75) {
                        return true;
                    }
                }
                prev = p;
            }
        }
        return false;
    }

    private toVector(p: number[]): Vector {
        return { x: p[0], y: p[1] };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.time += this.delta * 0.05;

        ctx.beginPath();
        this.points.forEach((s, si) => {
            s.forEach((p, i) => {
                if (i == 0) {
                    ctx.moveTo(p[0], p[1]);
                } else {
                    ctx.lineTo(p[0], p[1]);
                }
            });

            if (si == 0) {
                ctx.closePath();
            }
        });

        ctx.setLineDash([0, 50, 0, 30]);
        ctx.strokeStyle = '#E9A186';
        ctx.lineWidth = 150;
        ctx.stroke();
        ctx.setLineDash([0, 150, 20, 70]);
        ctx.lineWidth = 165;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 125;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.lineWidth = 115 + this.animationPhaseAbs * 5;
        ctx.strokeStyle = '#AEE6EB';
        ctx.stroke();
        ctx.setLineDash([20, 50]);
        ctx.lineDashOffset = -this.time;
        ctx.lineWidth = 70;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 60;
        ctx.strokeStyle = '#AEE6EB';
        ctx.stroke();
        ctx.setLineDash([60, 70, 20, 80, 40]);
        ctx.lineDashOffset = -this.time * 1.5;
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // ctx.fillStyle = '#000';
        // ctx.font = '80px monospace';
        // this.points.forEach((s) => {
        //     s.forEach((p, i) => {
        //         ctx.fillText(i + '', p[0], p[1]);
        //     });
        // });
    }
}
