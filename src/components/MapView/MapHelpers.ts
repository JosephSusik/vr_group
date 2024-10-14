import { Style, Icon, Stroke } from 'ol/style';

import infantryIconPng from '../../assets/infantry.png';
import infantryEnemyIconPng from '../../assets/enemy_infantry.png';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';

export const infantryIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1], 
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: infantryIconPng, 
      scale: 0.05, 
    })
});

export const infantryEnemyIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1], 
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: infantryEnemyIconPng, 
      scale: 0.05, 
    })
});

export const lineStyle = new Style({
    stroke: new Stroke({
      color: 'red', 
      width: 2, 
    }),
});

export function generatePath(startFeature: Feature<Point>, northDistanceKm: number, eastDistanceM: number, angleDeg: number): [number, number][] {
    const start = toLonLat(startFeature.getGeometry()?.getCoordinates()!) as [number, number];
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

  
export function createInfantry(callsign:string, type:string, curr_task:string, amount_ammo:string, coordinates:[number, number], ally:boolean) {
    const marker = new Feature({
        geometry: new Point(fromLonLat(coordinates)),
        callsign: callsign,
        type: type,
        position: coordinates,
        curr_task: curr_task,
        amount_ammo: amount_ammo
    });

    ally? marker.setStyle(infantryIcon) : marker.setStyle(infantryEnemyIcon);

    return marker;
}

export function isPointFeature(feature: any): feature is Feature<Point> {
    return feature instanceof Feature && feature.getGeometry() instanceof Point;
}
