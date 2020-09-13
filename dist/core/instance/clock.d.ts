export declare function initClock(cm: any): void;
interface SetClockOpt {
    clockStep: number;
    clockRange: number;
    multiplier: number;
    shouldAnimate: boolean;
}
export declare function setClock(startTime: string, endTime: string, currentTime: string, option?: SetClockOpt): object;
export {};
