export class Limbs {
    public root = 10;
    public mid = -12;
    public walking = true;
    public walkPhase = 0;
    public armPos = 10;
    public air = 0;

    constructor(private legs: number[][], private arms: number[][]) {
    }

    update(tick: number): void {
        this.walkPhase = Math.sin(tick * 0.02);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        this.legs.forEach((l, i) => {
            const rise = this.walking ? Math.min(this.walkPhase * 5 * (i % 2 == 0 ? -1 : 1), 0) : 0 + this.air;
            const voff = this.air * Math.sign(l[0]);
            ctx.moveTo(l[0] - voff, l[1] + rise);
            ctx.quadraticCurveTo(l[0] * 1.2 + rise * Math.sign(l[0]) - voff, this.root + rise, -rise * Math.sign(l[0]), this.root);
        });
        this.arms.forEach(l => {
            const voff = this.air * 0.5 * Math.sign(l[0]);
            ctx.moveTo(l[0] - voff, l[1] + this.mid + this.root + this.armPos);
            ctx.quadraticCurveTo(l[0] - voff, l[1] + this.mid * 1.2 + this.root, 0, this.root + this.mid);
        });
        ctx.stroke();
    }
}
