declare class Clock {
    autoStart: boolean;
    startTime: number;
    oldTime: number;
    elapsedTime: number;
    running: boolean;
    constructor(autoStart?: boolean);
    start(): void;
    stop(): void;
    getElapsedTime(): number;
    getDelta(): number;
}
export { Clock };
