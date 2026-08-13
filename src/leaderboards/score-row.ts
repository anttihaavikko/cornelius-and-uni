import { asScoreWithSuffix } from '../engine/math';
import { Entity } from '../engine/entity';
import { TextEntity } from '../engine/text';
import { Vector, ZERO } from '../engine/vector';
import { Score } from './score';
import { Game } from '../engine/game';

export class ScoreRow extends Entity {
    private name: TextEntity;
    private score: TextEntity;
    private locale: string;
    private meta: string;

    constructor(game: Game, row: number, width: number, private flags: HTMLImageElement) {
        super(game, 0, row * 25, 10, width);
        this.name = new TextEntity(game, '', 20, 30, 25 * row, -1, ZERO, { shadow: 2, align: 'left' });
        this.score = new TextEntity(game, '', 20, width, 25 * row, -1, ZERO, { shadow: 2, align: 'right' });
    }

    public getMeta(): string {
        return this.meta;
    }

    // public setColor(color: string): void {
    //     this.name.setColor(color);
    //     this.score.setColor(color);
    // }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.name.draw(ctx);
        this.score.draw(ctx);
        if (this.locale) {
            const coords = this.getFlagCoordinates(this.locale);
            ctx.drawImage(this.flags, coords.x * 32, coords.y * 32, 32, 32, 0, this.p.y - 17, 21, 21);
        }
    }

    public clear(): void {
        this.name.content = '';
        this.score.content = '';
        this.locale = null;
        this.meta = null;
    }

    public setup(row: Score): void {
        this.name.content = `${row.position}.  ${row.name}`;
        this.score.content = asScoreWithSuffix(row[Object.keys(row)[0]], 9);
        if (row.level >= 999) this.score.content += ' ✦';
        this.locale = row.locale;
        this.meta = row[Object.keys(row)[2]];
    }

    private createVector(x: number, y: number): Vector {
        return { x, y };
    }

    public getFlagCoordinates(country: string): Vector {
        if (country == 'bj') return this.createVector(256/32,32/32);
        if (country == 'tm') return this.createVector(160/32,416/32);
        if (country == 'eg') return this.createVector(384/32,96/32);
        if (country == 'tv') return this.createVector(320/32,416/32);
        if (country == 'kz') return this.createVector(320/32,224/32);
        if (country == 'lk') return this.createVector(0,256/32);
        if (country == 'ai') return this.createVector(128/32,0);
        if (country == 'dj') return this.createVector(160/32,96/32);
        if (country == 'va') return this.createVector(96/32,448/32);
        if (country == 'gy') return this.createVector(288/32,160/32);
        if (country == 'fi') return this.createVector(64/32,128/32);
        if (country == 'ne') return this.createVector(0,320/32);
        if (country == 'jp') return this.createVector(448/32,192/32);
        if (country == 'cv') return this.createVector(32/32,96/32);
        if (country == 'nz') return this.createVector(224/32,320/32);
        if (country == 'pa') return this.createVector(288/32,320/32);
        if (country == 'mn') return this.createVector(32/32,288/32);
        if (country == 'dm') return this.createVector(224/32,96/32);
        if (country == 'bh') return this.createVector(192/32,32/32);
        if (country == 'de') return this.createVector(128/32,96/32);
        if (country == 'ki') return this.createVector(96/32,224/32);
        if (country == 'nl') return this.createVector(96/32,320/32);
        if (country == 'ye') return this.createVector(352/32,448/32);
        if (country == 'it') return this.createVector(288/32,192/32);
        if (country == 'lb') return this.createVector(384/32,224/32);
        if (country == 'ru') return this.createVector(320/32,352/32);
        if (country == 'zm') return this.createVector(416/32,448/32);
        if (country == 'mm') return this.createVector(0,288/32);
        if (country == 'in') return this.createVector(160/32,192/32);
        if (country == 'fo') return this.createVector(160/32,128/32);
        if (country == 'cd') return this.createVector(128/32,64/32);
        if (country == 've') return this.createVector(160/32,448/32);
        if (country == 'qa') return this.createVector(192/32,352/32);
        if (country == 'gi') return this.createVector(448/32,128/32);
        if (country == 'mr') return this.createVector(128/32,288/32);
        if (country == 'gg') return this.createVector(384/32,128/32);
        if (country == 'do') return this.createVector(256/32,96/32);
        if (country == 'sk') return this.createVector(128/32,384/32);
        if (country == 'bz') return this.createVector(64/32,64/32);
        if (country == 'se') return this.createVector(32/32,384/32);
        if (country == 'uz') return this.createVector(64/32,448/32);
        if (country == 'rw') return this.createVector(352/32,352/32);
        if (country == 'tt') return this.createVector(288/32,416/32);
        if (country == 'ma') return this.createVector(224/32,256/32);
        if (country == 'mh') return this.createVector(384/32,256/32);
        if (country == 'at') return this.createVector(352/32,0);
        if (country == 'om') return this.createVector(256/32,320/32);
        if (country == 'fj') return this.createVector(96/32,128/32);
        if (country == 'bs') return this.createVector(416/32,32/32);
        if (country == 'pf') return this.createVector(352/32,320/32);
        if (country == 'gm') return this.createVector(32/32,160/32);
        if (country == 'sz') return this.createVector(416/32,384/32);
        if (country == 'ga') return this.createVector(224/32,128/32);
        if (country == 'lu') return this.createVector(128/32,256/32);
        if (country == 'np') return this.createVector(160/32,320/32);
        if (country == 'bg') return this.createVector(160/32,32/32);
        if (country == 'pr') return this.createVector(32/32,352/32);
        if (country == 'be') return this.createVector(96/32,32/32);
        if (country == 'sg') return this.createVector(64/32,384/32);
        if (country == 'ls') return this.createVector(64/32,256/32);
        if (country == 'pt') return this.createVector(96/32,352/32);
        if (country == 'am') return this.createVector(192/32,0);
        if (country == 'to') return this.createVector(224/32,416/32);
        if (country == 'je') return this.createVector(352/32,192/32);
        if (country == 'ee') return this.createVector(352/32,96/32);
        if (country == 'nc') return this.createVector(448/32,288/32);
        if (country == 'vn') return this.createVector(256/32,448/32);
        if (country == 'gw') return this.createVector(256/32,160/32);
        if (country == 'hu') return this.createVector(448/32,160/32);
        if (country == 'md') return this.createVector(288/32,256/32);
        if (country == 'ci') return this.createVector(256/32,64/32);
        if (country == 'jm') return this.createVector(384/32,192/32);
        if (country == 'gr') return this.createVector(160/32,160/32);
        if (country == 'ml') return this.createVector(448/32,256/32);
        if (country == 'km') return this.createVector(128/32,224/32);
        if (country == 'vi') return this.createVector(224/32,448/32);
        if (country == 'ps') return this.createVector(64/32,352/32);
        if (country == 'bo') return this.createVector(352/32,32/32);
        if (country == 'zw') return this.createVector(448/32,448/32);
        if (country == 'sn') return this.createVector(224/32,384/32);
        if (country == 'mx') return this.createVector(320/32,288/32);
        if (country == 'uy') return this.createVector(32/32,448/32);
        if (country == 'vu') return this.createVector(288/32,448/32);
        if (country == 'ni') return this.createVector(64/32,320/32);
        if (country == 'ch') return this.createVector(224/32,64/32);
        if (country == 'ag') return this.createVector(96/32,0);
        if (country == 'sd') return this.createVector(0,384/32);
        if (country == 'bw') return this.createVector(0,64/32);
        if (country == 'us') return this.createVector(0,448/32);
        if (country == 'ph') return this.createVector(416/32,320/32);
        if (country == 'lc') return this.createVector(416/32,224/32);
        if (country == 'is') return this.createVector(256/32,192/32);
        if (country == 'ws') return this.createVector(320/32,448/32);
        if (country == 'ly') return this.createVector(192/32,256/32);
        if (country == 'gn') return this.createVector(64/32,160/32);
        if (country == 'gu') return this.createVector(224/32,160/32);
        if (country == 'ke') return this.createVector(0,224/32);
        if (country == 'hr') return this.createVector(384/32,160/32);
        if (country == 'ge') return this.createVector(320/32,128/32);
        if (country == 'hk') return this.createVector(320/32,160/32);
        if (country == 're') return this.createVector(224/32,352/32);
        if (country == 'al') return this.createVector(160/32,0);
        if (country == 'co') return this.createVector(416/32,64/32);
        if (country == 'er') return this.createVector(448/32,96/32);
        if (country == 'sy') return this.createVector(384/32,384/32);
        if (country == 'ro') return this.createVector(256/32,352/32);
        if (country == 'th') return this.createVector(64/32,416/32);
        if (country == 'sl') return this.createVector(160/32,384/32);
        if (country == 'nr') return this.createVector(192/32,320/32);
        if (country == 'br') return this.createVector(384/32,32/32);
        if (country == 'ec') return this.createVector(320/32,96/32);
        if (country == 'kr') return this.createVector(224/32,224/32);
        if (country == 'pg') return this.createVector(384/32,320/32);
        if (country == 'mz') return this.createVector(384/32,288/32);
        if (country == 'sa') return this.createVector(384/32,352/32);
        if (country == 'gt') return this.createVector(192/32,160/32);
        if (country == 'kg') return this.createVector(32/32,224/32);
        if (country == 'bi') return this.createVector(224/32,32/32);
        if (country == 'cu') return this.createVector(0,96/32);
        if (country == 'tg') return this.createVector(32/32,416/32);
        if (country == 'dz') return this.createVector(288/32,96/32);
        if (country == 'bt') return this.createVector(448/32,32/32);
        if (country == 'lr') return this.createVector(32/32,256/32);
        if (country == 'rs') return this.createVector(288/32,352/32);
        if (country == 'tw') return this.createVector(352/32,416/32);
        if (country == 'aw') return this.createVector(416/32,0);
        if (country == 'py') return this.createVector(160/32,352/32);
        if (country == 'kh') return this.createVector(64/32,224/32);
        if (country == 'gq') return this.createVector(128/32,160/32);
        if (country == 'gh') return this.createVector(416/32,128/32);
        if (country == 'st') return this.createVector(320/32,384/32);
        if (country == 'tn') return this.createVector(192/32,416/32);
        if (country == 'mv') return this.createVector(256/32,288/32);
        if (country == 'ky') return this.createVector(288/32,224/32);
        if (country == 'hn') return this.createVector(352/32,160/32);
        if (country == 'fr') return this.createVector(192/32,128/32);
        if (country == 'si') return this.createVector(96/32,384/32);
        if (country == 'id') return this.createVector(0,192/32);
        if (country == 'au') return this.createVector(384/32,0);
        if (country == 'tr') return this.createVector(256/32,416/32);
        if (country == 'my') return this.createVector(352/32,288/32);
        if (country == 'lt') return this.createVector(96/32,256/32);
        if (country == 'li') return this.createVector(448/32,224/32);
        if (country == 'cg') return this.createVector(192/32,64/32);
        if (country == 'by') return this.createVector(32/32,64/32);
        if (country == 'bn') return this.createVector(320/32,32/32);
        if (country == 'mg') return this.createVector(352/32,256/32);
        if (country == 'fm') return this.createVector(128/32,128/32);
        if (country == 'tz') return this.createVector(384/32,416/32);
        if (country == 'sb') return this.createVector(416/32,352/32);
        if (country == 'as') return this.createVector(320/32,0);
        if (country == 'il') return this.createVector(64/32,192/32);
        if (country == 'ng') return this.createVector(32/32,320/32);
        if (country == 'mk') return this.createVector(416/32,256/32);
        if (country == 'no') return this.createVector(128/32,320/32);
        if (country == 'af') return this.createVector(64/32,0);
        if (country == 'ua') return this.createVector(416/32,416/32);
        if (country == 'sc') return this.createVector(448/32,352/32);
        if (country == 'cf') return this.createVector(160/32,64/32);
        if (country == 'ck') return this.createVector(288/32,64/32);
        if (country == 'cr') return this.createVector(448/32,64/32);
        if (country == 'kw') return this.createVector(256/32,224/32);
        if (country == 'ae') return this.createVector(32/32,0);
        if (country == 'iq') return this.createVector(192/32,192/32);
        if (country == 'vc') return this.createVector(128/32,448/32);
        if (country == 'gd') return this.createVector(288/32,128/32);
        if (country == 'pw') return this.createVector(128/32,352/32);
        if (country == 'me') return this.createVector(320/32,256/32);
        if (country == 'ad') return this.createVector(0,0);
        if (country == 'gb') return this.createVector(256/32,128/32);
        if (country == 'ug') return this.createVector(448/32,416/32);
        if (country == 'mo') return this.createVector(64/32,288/32);
        if (country == 'kp') return this.createVector(192/32,224/32);
        if (country == 'ba') return this.createVector(0,32/32);
        if (country == 'cn') return this.createVector(384/32,64/32);
        if (country == 'bf') return this.createVector(128/32,32/32);
        if (country == 'eh') return this.createVector(416/32,96/32);
        if (country == 'cy') return this.createVector(64/32,96/32);
        if (country == 'ir') return this.createVector(224/32,192/32);
        if (country == 'so') return this.createVector(256/32,384/32);
        if (country == 'za') return this.createVector(384/32,448/32);
        if (country == 'tl') return this.createVector(128/32,416/32);
        if (country == 'es') return this.createVector(0,128/32);
        if (country == 'tc') return this.createVector(448/32,384/32);
        if (country == 'sm') return this.createVector(192/32,384/32);
        if (country == 'jo') return this.createVector(416/32,192/32);
        if (country == 'sr') return this.createVector(288/32,384/32);
        if (country == 'ht') return this.createVector(416/32,160/32);
        if (country == 'la') return this.createVector(352/32,224/32);
        if (country == 'ie') return this.createVector(32/32,192/32);
        if (country == 'mw') return this.createVector(288/32,288/32);
        if (country == 'ar') return this.createVector(288/32,0);
        if (country == 'gp') return this.createVector(96/32,160/32);
        if (country == 'et') return this.createVector(32/32,128/32);
        if (country == 'mq') return this.createVector(96/32,288/32);
        if (country == 'mu') return this.createVector(224/32,288/32);
        if (country == 'bd') return this.createVector(64/32,32/32);
        if (country == 'bm') return this.createVector(288/32,32/32);
        if (country == 'pk') return this.createVector(448/32,320/32);
        if (country == 'gl') return this.createVector(0,160/32);
        if (country == 'pl') return this.createVector(0,352/32);
        if (country == 'cz') return this.createVector(96/32,96/32);
        if (country == 'dk') return this.createVector(192/32,96/32);
        if (country == 'mc') return this.createVector(256/32,256/32);
        if (country == 'td') return this.createVector(0,416/32);
        if (country == 'sv') return this.createVector(352/32,384/32);
        if (country == 'an') return this.createVector(224/32,0);
        if (country == 'pe') return this.createVector(320/32,320/32);
        if (country == 'ms') return this.createVector(160/32,288/32);
        if (country == 'bb') return this.createVector(32/32,32/32);
        if (country == 'lv') return this.createVector(160/32,256/32);
        if (country == 'cm') return this.createVector(352/32,64/32);
        if (country == 'im') return this.createVector(128/32,192/32);
        if (country == 'vg') return this.createVector(192/32,448/32);
        if (country == 'az') return this.createVector(448/32,0);
        if (country == 'mt') return this.createVector(192/32,288/32);
        if (country == 'ca') return this.createVector(96/32,64/32);
        if (country == 'tj') return this.createVector(96/32,416/32);
        if (country == 'ao') return this.createVector(256/32,0);
        if (country == 'cl') return this.createVector(320/32,64/32);
        if (country == 'kn') return this.createVector(160/32,224/32);
        if (country == 'na') return this.createVector(416/32,288/32);
        return this.createVector(0, 0);
    }
}
