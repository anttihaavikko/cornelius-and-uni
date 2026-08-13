/* eslint-disable @typescript-eslint/no-explicit-any */

export type AchievementId = 'WIN' | 'CARGO' | 'UNKNOWN' | 'MARK' | 'EAGER' | 'SCROLL' | 'SWIRL' |
    'TRIDENT' | 'SPICE' | 'ROSA' | 'PLUS' | 'PEARL' | 'NO' | 'LETTERS' | 'FROG' | 'FISH' | 'LOSE' |
    'CREW' | 'CRIT' | 'SPOON' | 'PIRATES' | 'SURVIVE' | 'THIRTEEN' | 'LUCKY' | 'ANGEL' | 'DEVIL' |
    'CLAM' | 'KARMA' | 'TREASURE' | 'MATH' | 'MEMORY' | 'REWIND' | 'SKELLIES' | 'PIZZA';

const unlocked: AchievementId[] = [];

export const unlockAchievement = (id: AchievementId): void => {
    if (unlocked.includes(id)) return;
    unlocked.push(id);
    
    if (!isTauri()) {
        if (window.location.href.includes('localhost')) console.log('Unlock achievement ' + id);
        return;
    }

    callTauriWith('achievement', { 'id': id });
};

export const isTauri = (): boolean => {
    return (window as any).__TAURI__;
};

export const callTauri = (fn: string): void => {
    (window as any).__TAURI__.core.invoke(fn);
};

export const callTauriWith = (fn: string, params: unknown): void => {
    (window as any).__TAURI__.core.invoke(fn, params);
};

export const tauriFullscreen = async (): Promise<void> => {
    if (isTauri()) {
        const isFull = await (window as any).__TAURI__.window.getCurrentWindow().isFullscreen();
        await (window as any).__TAURI__.window.getCurrentWindow().setFullscreen(!isFull);
    }
};

export const tauriShowMouse = async (visible: boolean): Promise<void> => {
    document.body.style.cursor = visible ? 'default' : 'none';
    if (isTauri()) {
        await (window as any).__TAURI__.window.getCurrentWindow().setCursorVisible(visible);
    }
};