import type {
  GeoZoneCardStyle,
  GeoZoneStyle,
  ZoneColor,
} from "@/utils/types/geoZoneStyle";

export type { GeoZoneCardStyle, GeoZoneStyle } from "@/utils/types/geoZoneStyle";

const ZONE_COLORS: Record<string, ZoneColor> = {
  "DRA-P": {
    rgb: "220, 38, 38",
    accentColor: "#DC2626",
    fillAlpha: 0.22,
    strokeAlpha: 0.95,
    strokeWidth: 2,
    cardBackground: "#FDE8E8",
  },
  "DRA-R": {
    rgb: "234, 179, 8",
    accentColor: "#EAB308",
    fillAlpha: 0.14,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
    cardBackground: "#FEF3C7",
  },
  "DRA-RH": {
    rgb: "34, 197, 94",
    accentColor: "#22C55E",
    fillAlpha: 0.12,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
    cardBackground: "#DCFCE7",
  },
  "DRA-RM": {
    rgb: "56, 189, 248",
    accentColor: "#38BDF8",
    fillAlpha: 0.1,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
    cardBackground: "#E0F2FE",
  },
  "DRA-RL": {
    rgb: "168, 85, 247",
    accentColor: "#A855F7",
    fillAlpha: 0.1,
    strokeAlpha: 0.9,
    strokeWidth: 1.5,
    cardBackground: "#F3E8FF",
  },
};

const DEFAULT_COLOR: ZoneColor = {
  rgb: "107, 114, 128",
  accentColor: "#6B7280",
  fillAlpha: 0.1,
  strokeAlpha: 0.8,
  strokeWidth: 1,
  cardBackground: "#F3F4F6",
};

const LARGE_ZONE_AREA_DEG2 = 0.02;
const LARGE_ZONE_FILL_FACTOR = 0.35;

export const normalizeGeoZoneType = (type?: string): string =>
  type?.trim().toUpperCase().replace(/[_\s]+/g, "-") ?? "";

export const isProhibitedGeoZoneType = (type?: string): boolean =>
  normalizeGeoZoneType(type) === "DRA-P";

export const getGeoZoneCardStyle = (type?: string): GeoZoneCardStyle => {
  const color = ZONE_COLORS[normalizeGeoZoneType(type)] ?? DEFAULT_COLOR;

  return {
    accentColor: color.accentColor,
    backgroundColor: color.cardBackground,
  };
};

export const getGeoZoneStyle = (
  type?: string,
  areaDeg2: number = 0,
): GeoZoneStyle => {
  const key = normalizeGeoZoneType(type);
  const color = ZONE_COLORS[key] ?? DEFAULT_COLOR;
  const fillFactor =
    areaDeg2 > LARGE_ZONE_AREA_DEG2 ? LARGE_ZONE_FILL_FACTOR : 1;

  return {
    fillColor: `rgba(${color.rgb}, ${(color.fillAlpha * fillFactor).toFixed(3)})`,
    strokeColor: `rgba(${color.rgb}, ${color.strokeAlpha})`,
    strokeWidth: color.strokeWidth,
  };
};
