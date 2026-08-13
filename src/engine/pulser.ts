export class Pulser {
    public ratio: number = 0;

    private phase: number = 0;
    private speed: number = 1;

    public update(delta: number): void {
        this.phase = Math.max(0, this.phase - delta * this.speed);
        this.ratio = Math.sin(this.phase * Math.PI);
    }

    public pulse(speed: number = 1): void {
        this.speed = speed;
        this.phase = 1;
    }
}