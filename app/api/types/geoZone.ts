export interface LatLon {
  lat: number;
  lon: number;
}

export interface BoundingBox {
  min_lon: number;
  min_lat: number;
  max_lon: number;
  max_lat: number;
}

export interface GeoZoneRequestParams {
  bounding_box: BoundingBox;
  user_pos: LatLon;
}

export type GeoJsonPosition = [lon: number, lat: number];

export interface GeoZonePolygonGeometry {
  type: "Polygon";
  coordinates: GeoJsonPosition[][];
}

export type GeoZoneType = "Flight prohibited" | (string & {});

export interface GeoZoneProperties {
  country_id: number;
  country: string;
  type: GeoZoneType;
  tag: string;
  strength: number;
  height_agl: number;
  activity_time: string | null;
}

export interface GeoZoneFeature {
  type: "Feature";
  geometry: GeoZonePolygonGeometry;
  properties: GeoZoneProperties;
}

export interface GeoZoneCollection {
  type: "FeatureCollection";
  features: GeoZoneFeature[];
}
