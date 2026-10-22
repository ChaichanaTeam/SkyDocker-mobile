export interface GeoZoneStyle {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

interface ZoneColor {
  rgb: string;
  fillAlpha: number;
  strokeAlpha: number;
  strokeWidth: number;
}

const ZONE_COLORS: Record<string, ZoneColor> = {
  "DRA-P": {
    rgb: "220, 38, 38",
    fillAlpha: 0.22,
    strokeAlpha: 0.95,
    strokeWidth: 2,
  },
  "DRA-R": {
    rgb: "234, 179, 8",
    fillAlpha: 0.14,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
  },
  "DRA-RH": {
    rgb: "34, 197, 94",
    fillAlpha: 0.12,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
  },
  "DRA-RM": {
    rgb: "56, 189, 248",
    fillAlpha: 0.1,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
  },
  "DRA-RL": {
    rgb: "168, 85, 247",
    fillAlpha: 0.1,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
  },
};

const DEFAULT_COLOR: ZoneColor = {
  rgb: "107, 114, 128",
  fillAlpha: 0.1,
  strokeAlpha: 0.8,
  strokeWidth: 1,
};

const LARGE_ZONE_AREA_DEG2 = 0.02;
const LARGE_ZONE_FILL_FACTOR = 0.35;

export const getGeoZoneStyle = (
  type?: string,
  areaDeg2: number = 0,
): GeoZoneStyle => {
  const key = type?.toUpperCase().replace(/_/g, "-") ?? "";
  const color = ZONE_COLORS[key] ?? DEFAULT_COLOR;
  const fillFactor =
    areaDeg2 > LARGE_ZONE_AREA_DEG2 ? LARGE_ZONE_FILL_FACTOR : 1;

  return {
    fillColor: `rgba(${color.rgb}, ${(color.fillAlpha * fillFactor).toFixed(3)})`,
    strokeColor: `rgba(${color.rgb}, ${color.strokeAlpha})`,
    strokeWidth: color.strokeWidth,
  };
};
