import 'ol/ol.css';
import { useEffect, useRef } from 'react';
import { Feature, Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import "./MapView.css"
import { fromLonLat } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, RegularShape } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';

interface MapViewProps {
  log: (message: string) => void,
  setInfo: (info: any) => void
}

// Function to generate a path: 0.5 km north then 200 m southeast
function generatePath(start: [number, number], northDistanceKm: number, eastDistanceM: number, angleDeg: number): [number, number][] {
  const distanceDegreesNorth = northDistanceKm / 111.32; // Convert kilometers to degrees for north movement

  // Calculate new north coordinate
  const northCoordinate: [number, number] = [start[0], start[1] + distanceDegreesNorth];

  // Calculate the new coordinates after moving 200 m at a 45-degree angle
  const distanceDegreesEast = (eastDistanceM / 1000) / 111.32; // Convert meters to kilometers then to degrees
  const angleRad = (angleDeg * Math.PI) / 180; // Convert angle to radians

  // Calculate the new coordinates moving at a 45-degree angle
  const eastCoordinate: [number, number] = [
    northCoordinate[0] + (distanceDegreesEast * Math.cos(angleRad)),
    northCoordinate[1] + (distanceDegreesEast * Math.sin(angleRad))
  ];

  return [start, northCoordinate, eastCoordinate]; // Return the path from start to north to southeast
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

    // Create the marker as a feature
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
      callsign: 'A1 Inf',
      type: 'Light infantry',
      position: coordinates,
      curr_task: 'Move',
      amount_ammo: 'None'
    });

    // Create a style for the marker (red circle)
    marker.setStyle(
      new Style({
        // Rectangle fill
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red
        }),
        // Rectangle outline
        stroke: new Stroke({
          color: 'black',
          width: 1,
        }),
        // RegularShape to create the rectangle
        // Using RegularShape to create diagonals as lines
        image: new RegularShape({
          fill: new Fill({ color: 'rgba(255, 0, 0, 0.5)' }),
          stroke: new Stroke({
            color: 'black',
            width: 2,
          }),
          points: 4, // Number of points for the rectangle (4)
          radius: 10, // Half the width/height of the rectangle
          angle: Math.PI / 4, // Rotate the rectangle to create diagonals
        }),
      })
    );

    // Add the marker to the vector source
    vectorSource.addFeature(marker);

    // Create a vector layer with the vector source
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Add the vector layer to the map
    mapObj.addLayer(vectorLayer);

    // Variable to track the last selected marker
    let lastSelectedMarker: Feature<Point>|null = null;

    // Generate a straight line north from the marker
    const lineCoordinates = generatePath(coordinates, 0.5, 200, 45); // 0.5 km north, 200 m at 45 degrees
    const newLineString = new LineString(lineCoordinates.map(coord => fromLonLat(coord)));

    // Create a new line feature
    const newLineFeature = new Feature(newLineString);

    // Add the line feature to the vector source
    vectorSource.addFeature(newLineFeature);
    newLineFeature.setStyle(new Style({}));

    // Add click event listener to the marker
    mapObj.on('singleclick', (event) => {
      mapObj.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature === marker) {
          // Check if the same marker is clicked again
          if (lastSelectedMarker === marker) {
            log(`Entity ${feature.get('callsign')} deselected`);
            setInfo(null); // Reset the info when the same marker is clicked again
            newLineFeature.setStyle(new Style({}));
            lastSelectedMarker = null; // Reset the last selected marker
          } else {
            log(`Entity ${feature.get('callsign')} selected`);
            setInfo(feature.getProperties()); // Set the info for the selected marker
            lastSelectedMarker = marker; // Update last selected marker
           
            // Style the line feature
            newLineFeature.setStyle(
              new Style({
                stroke: new Stroke({
                  color: 'red', // Red color for the line
                  width: 2, // Line width
                }),
              })
            );
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