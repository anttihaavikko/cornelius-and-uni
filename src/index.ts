import { AudioManager } from './engine/audio';
import { Game } from './engine/game';
import { Mouse } from './engine/mouse';
import { Scene } from './scene';
// import 'tauri-plugin-gamepad-api';

const upScale = 2;
export const WIDTH = 800 * upScale;
export const HEIGHT = 400 * upScale;

const canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.style.userSelect = 'none';
canvas.style.touchAction = 'none';
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const mouse: Mouse = { x: 0, y: 0 };
const audio = new AudioManager();
// audio.prepare();
// audio.startMusic();
const game = new Game(audio, canvas);
game.scene = new Scene(game);

canvas.id = 'game';
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

let ratio = 1;
let x = 0;
let y = 0;
// let wasPortrait: boolean = null;

const resize = () => {
    // const portrait = window.innerHeight > window.innerWidth;
    // canvas.width = !portrait ? WIDTH : HEIGHT;
    // canvas.height = !portrait ? HEIGHT : WIDTH;
    ratio = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
    canvas.style.transformOrigin = 'top left';
    x = (window.innerWidth - canvas.width * ratio) * 0.5;
    y = (window.innerHeight - canvas.height * ratio) * 0.5;
    canvas.style.transform = `translate(${x}px,${y}px) scale(${ratio})`;
    // if (portrait !== wasPortrait) game.scene.ratioChanged(portrait);
    // wasPortrait = portrait;
};

resize();
window.onresize = resize;

let isFull = false;
document.onfullscreenchange = () => isFull = !isFull;

// const move = (x: number, y: number): void => {
//     mouse.x = (isFull ? (x - x) / ratio : x) / upScale;
//     mouse.y = (isFull ? (y - y) / ratio : y) / upScale;
// };

// document.onmousemove = (e: MouseEvent) => move(e.offsetX, e.offsetY);
// canvas.ontouchmove = (e: TouchEvent) => move(e.touches[0].clientX / ratio - x, e.touches[0].clientY / ratio - y);

window.onkeydown = (e: KeyboardEvent) => {
    // audio.startMusic();
    // game.pressed(e);
    game.held.push(e.key);
    game.audio.playMusic();
};

window.onkeyup = (e: KeyboardEvent) => {
    game.released(e);
    game.held = game.held.filter(k => k !== e.key);
};

// document.onmousedown = (e: MouseEvent) => {
//     // if (!audio.isPlaying()) audio.startMusic();
//     mouse.pressing = true;
//     mouse.holding = true;
//     game.click(mouse, !!e);
// };

// canvas.ontouchstart = (e: TouchEvent) => {
//     game.usingTouch = true;
//     move(e.touches[0].clientX / ratio - x, e.touches[0].clientY / ratio - y);
//     document.onmousedown(null);
// };

// document.onmouseup = canvas.ontouchcancel = canvas.ontouchend = () => {
//     mouse.pressing = false;
//     mouse.holding = false;
// };

const tick = (t: number) => {
    requestAnimationFrame(tick);
    ctx.resetTransform();
    game.update(t, mouse);
    ctx.scale(upScale, upScale);
    game.draw(ctx);
};

requestAnimationFrame(tick);
