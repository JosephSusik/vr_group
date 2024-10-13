import { useEffect, useState } from 'react'
import MapView from '../MapView/MapView';
import PanelView from '../PanelView/PanelView';

function Simulation() {
    const [simulationTime, setSimulationTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false); 
    const [logs, setLogs] = useState<string[]>([]);
    const [info, setInfo] = useState<any>();

    useEffect(() => {
        let intervalId: NodeJS.Timer;
        if (isRunning) {
          intervalId = setInterval(() => setSimulationTime(simulationTime + 1), 10);
        }
        return () => clearInterval(intervalId);

    }, [isRunning, simulationTime]);

    const hours = Math.floor(simulationTime / 360000);
    const minutes = Math.floor((simulationTime % 360000) / 6000).toString().padStart(2, "0");
    const seconds = Math.floor((simulationTime % 6000) / 100).toString().padStart(2, "0");
    const milliseconds = (simulationTime % 100).toString().padStart(2, "0");

    const playPause = () => {
        setIsRunning(!isRunning);
        addLog(isRunning ? 'Simulation paused' : 'Simulation started');
    }

    const resetTime = () => {
        setIsRunning(false);
        setSimulationTime(0);
        addLog('Simulation reset to 0');
    }

    // Step forward by a second
    const stepSimulation = () => {
        setSimulationTime(simulationTime + 100);
        addLog(`Simulation stepped forward by 100ms`);
    }

    const addLog = (message: string) => {
        let msg = `[${hours}:${minutes}:${seconds}:${milliseconds}]  ${message}`
        setLogs((prevLogs) => [...prevLogs, msg]);
    };

    const addLogNoTime = (message: string) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    const infoSet = (infos:Object) => {
            setInfo(infos);
    }

    return(
        <>
            <MapView log={addLogNoTime} setInfo={infoSet}/>
            <PanelView simulation={{
                simulationTime: simulationTime,
                isRunning: isRunning,   
                simulationPlayPause: playPause,
                simulationReset: resetTime,
                simulationStep: stepSimulation,
                logMsgs: logs,
                info: info!
            }} />
        </>
    );
}

export default Simulation;