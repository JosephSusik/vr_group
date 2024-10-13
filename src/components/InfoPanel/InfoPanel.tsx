import './InfoPanel.css'

function InfoPanel({props}:{props:any}) {
    return(
        <div className='infoPanel'>
            <p>Unit Info</p>
            {props?.callsign &&
                <div className='infoPanelInfo'>
                    <p>Callsign: {props?.callsign}</p>
                    <p>Type: {props?.type}</p>
                    <p>Position: {props?.position[0]}, {props?.position[1]}</p>
                    <p>Ammo Amout: {props?.amount_ammo}</p>
                    <p>Current Task: {props?.curr_task}</p>
                </div>
            }
        </div>
    );
}

export default InfoPanel;