import { useEffect, useRef } from 'react';
import './DataLogPanel.css'

function DataLogPanel({logs}:{logs:string[]}) {
    const logEndRef = useRef<HTMLDivElement | null>(null); // Reference for the end of the logs

    // Always scroll to bottom, to show newest logs
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
    
    return(
        <div className='dataLogPanel'>
            <p>Data Log</p>
            <div className='dataLogOutput'>
                {logs.map((log, index) => (
                    <p key={index}>{log}</p>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
}

export default DataLogPanel;