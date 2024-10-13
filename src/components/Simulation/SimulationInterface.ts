export interface SimulationInterface {
    simulationTime: number;
    isRunning: boolean;
    simulationPlayPause: Function;
    simulationReset: Function;
    simulationStep: Function;
    logMsgs: string[];
    info: Object;
}