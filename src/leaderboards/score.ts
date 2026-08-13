export interface Scores {
    scores: Score[];
}

export interface Score {
    date: string;
    level: number;
    locale: string;
    name: string;
    pid: string;
    position: number;
    score: string;
    meta: string;
}