import './SimulationPanel.css'

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { SimulationInterface } from '../Simulation/SimulationInterface';

function SimulationPanel({ simulationTime, simulationPlayPause, simulationReset, isRunning, simulationStep }: SimulationInterface) {
    const hours = Math.floor(simulationTime / 360000);
    const minutes = Math.floor((simulationTime % 360000) / 6000).toString().padStart(2, "0");
    const seconds = Math.floor((simulationTime % 6000) / 100).toString().padStart(2, "0");
    const milliseconds = (simulationTime % 100).toString().padStart(2, "0");
    
    return(
        <div className='simulationPanel'>
            <p>Simulation Controls</p>
            <div className='simulationControls'>
                <div className='simulationBtns'>
                    <div className='clickableBtns' onClick={()=>simulationPlayPause()}>
                        {isRunning?
                            <PauseIcon />
                            :
                            <PlayArrowIcon />
                        }
                    </div>
                    <div className='clickableBtns' onClick={()=>simulationStep()}>
                        <SkipNextIcon />
                    </div>
                    <div  className='clickableBtns' onClick={()=>simulationReset()}>
                        <StopIcon />
                    </div>
                </div>
                <div className='simulationInfo'>
                    <p>Current Simulation Time:</p>
                    <p>{hours}:{minutes}:{seconds}:{milliseconds}</p>
                </div>
            </div>
        </div>
    );
}

export default SimulationPanel;