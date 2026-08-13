import { COLORS } from './colors';

export const drawBg = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(-100, -100, ctx.canvas.width + 200, ctx.canvas.height + 200);
    
    ctx.strokeStyle = COLORS.dark;
    ctx.setLineDash([0, 53]);
    ctx.lineDashOffset = 5;
    ctx.lineWidth = 60;
    ctx.lineCap = 'round';

    const portrait = window.innerHeight > window.innerWidth;
    const w = portrait ? 400 : 800;
    const h = portrait ? 800 : 400;

    const drawLine = (h: number, dip: number) => {
        ctx.beginPath();
        ctx.moveTo(-100, dip);
        ctx.quadraticCurveTo(w / 2, h, w + 100, dip);
        ctx.stroke();
    };

    drawLine(h + 20, h - 20);
    drawLine(0, 80);
    drawLine(0, 45);
    drawLine(0, 10);

    ctx.setLineDash([]);
};