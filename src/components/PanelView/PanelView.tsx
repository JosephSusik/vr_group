import { Reorder } from 'framer-motion';
import './PanelView.css'
import { useState } from 'react';
import PanelItem from '../PanelItem/PanelItem';
import { SimulationInterface } from '../Simulation/SimulationInterface';

interface PanelViewProps {
  simulation: SimulationInterface
}

function PanelView({simulation}:PanelViewProps) {
    const initialItems = ["Simulation", "Info", "DataLog"];

    const [items, setItems] = useState(initialItems);

    return (
      <Reorder.Group axis="y" onReorder={setItems} values={items} className='panelView'>
        {items.map((item) => (
          <PanelItem 
            key={item}
            item={item} 
            simulation={simulation}            
          />
        ))}
      </Reorder.Group>
    );
}

export default PanelView;