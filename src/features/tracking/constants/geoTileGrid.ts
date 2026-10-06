import type { BoundingBox } from "@app/api/types/geoZone";

export const TILE_STEP_LON = 0.5;
export const TILE_STEP_LAT = 0.5;

export interface TileKey {
  x: number;
  y: number;
}

export const tileKeyToString = ({ x, y }: TileKey): string => `${x}:${y}`;

export const tileKeyFor = (lon: number, lat: number): TileKey => ({
  x: Math.floor(lon / TILE_STEP_LON),
  y: Math.floor(lat / TILE_STEP_LAT),
});

export const tileKeyToBoundingBox = ({ x, y }: TileKey): BoundingBox => ({
  min_lon: x * TILE_STEP_LON,
  min_lat: y * TILE_STEP_LAT,
  max_lon: (x + 1) * TILE_STEP_LON,
  max_lat: (y + 1) * TILE_STEP_LAT,
});

export const tilesInBoundingBox = (bbox: BoundingBox): TileKey[] => {
  const minTile = tileKeyFor(bbox.min_lon, bbox.min_lat);
  const maxTile = tileKeyFor(bbox.max_lon, bbox.max_lat);

  const tiles: TileKey[] = [];
  for (let x = minTile.x; x <= maxTile.x; x++) {
    for (let y = minTile.y; y <= maxTile.y; y++) {
      tiles.push({ x, y });
    }
  }
  return tiles;
};

export const neighborTiles = (centerTiles: TileKey[]): TileKey[] => {
  const seen = new Set<string>();
  const result: TileKey[] = [];

  for (const { x, y } of centerTiles) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const candidate: TileKey = { x: x + dx, y: y + dy };
        const key = tileKeyToString(candidate);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(candidate);
        }
      }
    }
  }

  return result;
};
