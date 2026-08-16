import { COLORS } from './colors';
import { Entity } from './engine/entity';
import { Game } from './engine/game';
import { lerp } from './engine/math';
import { distance, Vector } from './engine/vector';

export class River extends Entity {
    private time = 0;
    private points: number[][][] = [
        [
            [-166, -754],
            [-788, -473],
            [-1561, -277, 1],
            [-1765, -784, 1],
            [-2187, -781, 1],
            [-2103, -11, 1],
            [-2503, 398],
            [-1971, 1045, 1],
            [-1222, 1393, 1],
            [-270, 1126, 1],
            [224, 1294, 1],
            [794, 1088],
            [1459, 1187, 1],
            [1943, 799],
            [2371, 172, 1],
            [1992, -532],
            [1428, -817, 1],
            [1239, -1123],
            [771, -1119, 1],
            [532, -764, 1],
            [-50, -754],
        ],
        [
            [2012, 762],
            [2518, 636],
            [2922, 767],
            [3383, 482],
            [3722, 539],
            [3873, 184],
            [3665, -188],
            [3731, -513],
            [3218, -719],
            [2807, -818],
            [2534, -591],
            [2304, -465],
            [1995, -522],
        ],
        [
            [2806, -859],
            [2637, -1161],
            [2234, -1485],
            [1806, -1402],
            [1250, -1146],
        ],
        [
            [-2523, 438],
            [-2673, 791],
            [-3080, 1017],
            [-3460, 1201],
            [-3329, 1692],
            [-3418, 2004],
            [-3099, 2103],
            [-2693, 2057],
            [-2397, 2212],
            [-1857, 2103],
            [-1485, 2145],
            [-1099, 2004],
            [-793, 2142],
            [-425, 1944, 1],
            [-42, 1788],
            [446, 1834],
            [694, 1691],
            [694, 1553],
            [839, 1461, 1],
            [1047, 1507, 1],
            [1301, 1469, 1],
            [1455, 1231, 1],
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
        ctx.strokeStyle = COLORS.brown;
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
