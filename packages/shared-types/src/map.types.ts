export type MapLayerType = 'satellite' | 'topo' | 'hybrid';

export type MarkerType = 'stand' | 'trail_camera' | 'bedding' | 'travel_route' | 'food_source';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  type: MarkerType;
  coordinates: Coordinates;
  label?: string;
}

export interface WindData {
  speed: number;       // mph
  direction: number;   // degrees (0-360)
  timestamp: string;
}

export type WindRisk = 'safe' | 'caution' | 'danger';

export interface WindAnalysis {
  windData: WindData;
  standId: string;
  risk: WindRisk;
  scentConeAngle: number;
}
