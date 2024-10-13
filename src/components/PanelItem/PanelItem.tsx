import * as React from "react";
import { useMotionValue, Reorder, useDragControls } from "framer-motion";
import { useRaisedShadow } from './UseRaisedShadow'
import './PanelItem.css'
import InfoPanel from "../InfoPanel/InfoPanel";
import SimulationPanel from "../SimulationPanel/SimulationPanel";
import DataLogPanel from "../DataLogPanel/DataLogPanel";
import { ReorderIcon } from "./DragControls";
import { SimulationInterface } from "../Simulation/SimulationInterface";

interface Props {
  item: string;
  simulation: SimulationInterface
}

function PanelItem({ item, simulation }: Props) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const controls = useDragControls()


  return (
    <Reorder.Item value={item} id={item} style={{ boxShadow, y }} className="panelItem" dragControls={controls} dragListener={false}>
        {item === 'Simulation' && <SimulationPanel {...simulation} />}
        {item === 'Info' && <InfoPanel props={simulation.info} />}
        {item === 'DataLog' && <DataLogPanel logs={simulation.logMsgs} />}
        <ReorderIcon dragControls={controls} />
    </Reorder.Item>
  );
};

export default PanelItem;

