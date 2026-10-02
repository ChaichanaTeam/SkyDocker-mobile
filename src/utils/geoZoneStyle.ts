export interface GeoZoneStyle {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

const ZONE_STYLES_BY_TAG: Record<string, GeoZoneStyle> = {
  "DRA-P": {
    fillColor: "rgba(220, 38, 38, 0.25)",
    strokeColor: "rgba(220, 38, 38, 0.9)",
    strokeWidth: 1.5,
  },
  "DRA-R": {
    fillColor: "rgba(234, 179, 8, 0.25)",
    strokeColor: "rgba(234, 179, 8, 0.9)",
    strokeWidth: 1.5,
  },
  "DRA-RH": {
    fillColor: "rgba(34, 197, 94, 0.25)",
    strokeColor: "rgba(34, 197, 94, 0.9)",
    strokeWidth: 1.5,
  },
  "DRA-RM": {
    fillColor: "rgba(56, 189, 248, 0.25)",
    strokeColor: "rgba(56, 189, 248, 0.9)",
    strokeWidth: 1.5,
  },
  "DRA-RL": {
    fillColor: "rgba(168, 85, 247, 0.25)",
    strokeColor: "rgba(168, 85, 247, 0.9)",
    strokeWidth: 1.5,
  },
};

const DEFAULT_ZONE_STYLE: GeoZoneStyle = {
  fillColor: "rgba(107, 114, 128, 0.2)",
  strokeColor: "rgba(107, 114, 128, 0.8)",
  strokeWidth: 1,
};

export const getGeoZoneStyle = (tag: string): GeoZoneStyle =>
  ZONE_STYLES_BY_TAG[tag] ?? DEFAULT_ZONE_STYLE;
