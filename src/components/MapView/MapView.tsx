import 'ol/ol.css';
import { useEffect, useRef } from 'react';
import { Feature, Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import "./MapView.css"
import { fromLonLat } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import { createInfantry, generatePath, isPointFeature, lineStyle } from './MapHelpers';
interface MapViewProps {
  log: (message: string) => void,
  setInfo: (info: any) => void
}


function MapView({log, setInfo}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    //Strážný 
    const coordinates:[number, number] = [13.7203763, 48.9083116];

    const mapObj = new Map({
      view: new View({
        center: fromLonLat(coordinates),
        zoom: 16,
      }),
      layers: [new Tile({ source: new OSM() })],
    });

    const vectorSource = new VectorSource();

    const infantry1 = createInfantry('A1 Inf', 'Light infantry', 'Move', 'None', [13.71, 48.905], true);
    const infantry2 = createInfantry('A2 Inf', 'Medium infantry', 'Fight', '1000', [13.712, 48.905], true);
    const infantry3 = createInfantry('A3 Inf', 'Heavy infantry', 'Stay', 'Infinite', [13.7105, 48.904], true);

    const enemyInfantry1 = createInfantry('B1 Inf', 'Very heavy infantry', 'Move', '42', [13.708, 48.9117], false);
    const enemyInfantry2 = createInfantry('B2 Inf', 'Light infantry', 'Move', '100', [13.709, 48.911], false);

    vectorSource.addFeature(infantry1);
    vectorSource.addFeature(infantry2);
    vectorSource.addFeature(infantry3);
    vectorSource.addFeature(enemyInfantry1);
    vectorSource.addFeature(enemyInfantry2);
    // Generate a straight line north from the infantry1
    const lineCoordinates = generatePath(infantry1, 0.5, 200, 135); // 0.5 km north, 200 m at 135 degrees
    const newLineString = new LineString(lineCoordinates.map(coord => fromLonLat(coord)));
 
  // Create a new line feature
    const newLineFeature = new Feature(newLineString);
 
    // Add the line feature to the vector source
    vectorSource.addFeature(newLineFeature);
    newLineFeature.setStyle(new Style({}));
    
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Variable to track the last selected marker
    let lastSelectedMarker: Feature<Point>|null = null;
    
    mapObj.addLayer(vectorLayer);

    // Add click event listener to the marker
    mapObj.on('singleclick', (event) => {
      mapObj.forEachFeatureAtPixel(event.pixel, (feature) => {
        //Check if point is a marker
        if (isPointFeature(feature)) {
          // Check if the same marker is clicked again
          if (lastSelectedMarker === feature) {
            log(`Entity ${feature.get('callsign')} deselected`);
            setInfo(null); // Reset the info when the same marker is clicked again
            lastSelectedMarker = null; // Reset the last selected marker
            newLineFeature.setStyle(new Style({}));
          } else {
            log(`Entity ${feature.get('callsign')} selected`);
            setInfo(feature.getProperties()); // Set the info for the selected marker
            lastSelectedMarker = feature; // Update last selected marker
            
            //Show line from Infantry1
            if(feature === infantry1) {
              newLineFeature.setStyle(lineStyle);
            } else {
              newLineFeature.setStyle(new Style({}));
            }
            
          }
        }
      });
    });


    mapObj.setTarget(mapRef.current);

    return () => mapObj.setTarget('');
  },[]);

  return (
    <div className='mapView'>
      <div className ="map" ref={mapRef} />
    </div>
  );
};

export default MapView;