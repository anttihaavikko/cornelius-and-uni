import { Entity } from '../engine/entity';
import { ScoreRow } from './score-row';
import flags from './flags.png';
import { Mouse } from '../engine/mouse';
import { Score, Scores } from './score';
import { Game } from '../engine/game';

export class Leaderboards extends Entity {
    private currentPage: number;
    private rows: ScoreRow[] = [];

    private playerName: string;
    private playerId: string;
    private hovered: ScoreRow;

    private previewFn: (row: ScoreRow) => void;
    private loadedFn: (scores: Score[]) => void;

    private hoverColor = '#F3DC00';

    constructor(game: Game, private prefix: string, private board: string, x: number, y: number, width: number, private perPage = 10) {
        super(game, x, y, 500, width);
        this.playerName = localStorage.getItem(`${this.prefix}-PlayerName`) ?? 'Anon';
        this.playerId = localStorage.getItem(`${this.prefix}-PlayerId`) ?? this.uuidv4();
        localStorage.setItem(`${this.prefix}-PlayerName`, this.playerName);
        localStorage.setItem(`${this.prefix}-PlayerId`, this.playerId);

        const flagsImage = new Image();
        flagsImage.src = flags;

        for (let i = 0; i < perPage; i++) {
            this.rows.push(new ScoreRow(this.game, i, width, flagsImage));
        }
    }

    public getPlayerId(): string {
        return this.playerId;
    }

    public isFirstPage(): boolean {
        return this.currentPage === 0;
    }

    public onLoaded(fn: (rows: Score[]) => void): void {
        this.loadedFn = fn;
    }
    
    public onPreview(fn: (row: ScoreRow) => void): void {
        this.previewFn = fn;
    }

    public update(tick: number, mouse: Mouse): void {
        if (mouse.x > 25 && mouse.x < 345 && mouse.y < 520 && mouse.y > 255) {
            const row = Math.round((mouse.y - 255 - 20) / 255 * 9);
            const next = this.rows[row];
            if (next == this.hovered) return;
            // this.hovered?.setColor('#fff');
            if (this.previewFn) this.previewFn(next);
            // if (next) {
            //     next.setColor(this.hoverColor);
            // }
            this.hovered = next;
            return;
        }

        if (this.hovered) {
            // this.hovered.setColor('#fff');
            this.hovered = null;
            if (this.previewFn) this.previewFn(null);
        }
    }

    public change(next: string): void {
        // console.log('change lb to', next);
        this.board = next;
        this.currentPage = 0;
        this.rows.forEach(r => r.clear());
        this.load(this.currentPage);
    }

    public changePage(dir: number): void {
        this.load(this.currentPage + dir);
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    public changeName(name: string): void {
        this.playerName = name;
        localStorage.setItem(`${this.prefix}-PlayerName`, this.playerName);
    }

    private uuidv4(): string {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    public load(page = 0): void {
        if (page < 0) return;
        this.currentPage = page;
        const url = `//games.sahaqiel.com/leaderboards/load-scores-with-meta-v2.php?nomax=1&amt=${this.perPage}&p=${this.currentPage}&game=${this.board}`;
        this.send(url, (json) => {
            this.rows.forEach(r => r.clear());
            const data = JSON.parse(json) as Scores;
            data.scores.forEach((s, i) => this.rows[i].setup(s));
            if (this.loadedFn) this.loadedFn(data.scores);
        });
    }

    public submit(score: number, level: number, meta: string): void {
        const check = this.getVerificationNumber(this.playerName, score, level);
        const url = 'https://games.sahaqiel.com/leaderboards/save-score-with-meta.php?str=' + [this.playerName, this.playerId, level, score, check, this.board].join(',');
        this.send(url + '&meta=' + encodeURIComponent(meta), () => {});
    }

    private getVerificationNumber(name: string, score: number, secondary: number): number {
        return (score % 456 + name.length * secondary * 123) % 79971;
    }

    private send(url: string, callback: (data: string) => void): void {
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        }).then(response => response.text()).then(json => callback(json));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.scale(this.scale.x, this.scale.y);
        this.rows.forEach(r => r.draw(ctx));
        ctx.translate(-this.p.x, -this.p.y);
        ctx.restore();
    }
}