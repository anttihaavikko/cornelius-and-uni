import { COLORS } from './colors';
import { Entity } from './engine/entity';
import { Game } from './engine/game';
import { lerp } from './engine/math';
import { distance, Vector } from './engine/vector';

export class River extends Entity {
    private time = 0;
    private points: number[][] = [
        [-166, -754],
        [-788, -473],
        [-1561, -277],
        [-1765, -784],
        [-2187, -781],
        [-2103, -11],
        [-2503, 398],
        [-1971, 1045],
        [-1222, 1393],
        [-270, 1126],
        [224, 1294],
        [794, 1088],
        [1459, 1187],
        [1943, 799],
        [2371, 172],
        [1992, -532],
        [1428, -817],
        [1239, -1123],
        [771, -1119],
        [532, -764],
        [-50, -754],
    ];

    constructor(game: Game) {
        super(game, 0, 0, 0, 0);
    }

    public isInside(point: Vector): boolean {
        let prev = this.points[0];
        for (const p of this.points.slice(1)) {
            const segments = distance(this.toVector(p), this.toVector(prev)) / 50;
            for (let i = 0; i <= 1; i += 1 / segments) {
                const pp: Vector = {
                    x: lerp(prev[0], p[0], i),
                    y: lerp(prev[1], p[1], i)
                }
                if (distance(point, pp) < 75) {
                    return true;
                }
            }
            prev = p;
        }
        return false;
    }

    private toVector(p: number[]): Vector {
        return { x: p[0], y: p[1] };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.time += this.delta * 0.05;

        ctx.beginPath();
        this.points.forEach((p, i) => {
            if (i == 0) {
                ctx.moveTo(p[0], p[1]);
            } else {
                ctx.lineTo(p[0], p[1]);
            }
        });
        ctx.closePath();

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
        ctx.lineDashOffset = 0;
    }
}
