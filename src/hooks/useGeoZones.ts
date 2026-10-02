import { useCallback, useEffect, useRef, useState } from "react";

import {
  neighborTiles,
  tileKeyToBoundingBox,
  tileKeyToString,
  tilesInBoundingBox,
  type TileKey,
} from "@/features/tracking/constants/geoTileGrid";
import { fetchGeoZones } from "@app/api/services/geoZone.service";
import { isApiError } from "@app/api/types/apiError";
import type {
  BoundingBox,
  GeoZoneFeature,
  LatLon,
} from "@app/api/types/geoZone";

const MAX_CONCURRENT_TILE_REQUESTS = 3;
const REGION_CHANGE_DEBOUNCE_MS = 300;

interface TileRequest {
  key: TileKey;
  keyString: string;
}

export const useGeoZones = () => {
  const [zonesByName, setZonesByName] = useState<Map<string, GeoZoneFeature>>(
    new Map(),
  );

  const loadedOrLoadingTiles = useRef<Set<string>>(new Set());

  const pendingQueue = useRef<TileRequest[]>([]);
  const activeRequests = useRef<Map<string, AbortController>>(new Map());

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processQueue = useCallback(
    function processQueueRequests(userPos: LatLon) {
      while (
        activeRequests.current.size < MAX_CONCURRENT_TILE_REQUESTS &&
        pendingQueue.current.length > 0
      ) {
        const next = pendingQueue.current.shift();
        if (!next) break;

        const controller = new AbortController();
        activeRequests.current.set(next.keyString, controller);

        const bbox: BoundingBox = tileKeyToBoundingBox(next.key);

        fetchGeoZones(bbox, userPos, controller.signal)
          .then((collection) => {
            setZonesByName((prev) => {
              const updated = new Map(prev);
              for (const feature of collection.features) {
                updated.set(feature.properties.name, feature);
              }
              return updated;
            });
          })
          .catch((e: unknown) => {
            if (e instanceof DOMException && e.name === "AbortError") {
              loadedOrLoadingTiles.current.delete(next.keyString);
              return;
            }

            if (isApiError(e) && e.status === 404) {
              return;
            }

            loadedOrLoadingTiles.current.delete(next.keyString);

            const apiError = e as {
              details?: { loc: unknown[]; msg: string }[];
            };
            if (apiError.details) {
              console.warn(
                `Tile ${next.keyString} missing fields:`,
                apiError.details.map(
                  (d) => `${JSON.stringify(d.loc)}: ${d.msg}`,
                ),
              );
            } else {
              console.warn(`Failed to load geo-zone tile ${next.keyString}`, e);
            }
          })
          .finally(() => {
            activeRequests.current.delete(next.keyString);
            processQueueRequests(userPos);
          });
      }
    },
    [],
  );

  const requestTilesForRegion = useCallback(
    (visibleBbox: BoundingBox, userPos: LatLon) => {
      const visibleTiles = tilesInBoundingBox(visibleBbox);
      const tilesToLoad = neighborTiles(visibleTiles);

      for (const tile of tilesToLoad) {
        const keyString = tileKeyToString(tile);
        if (loadedOrLoadingTiles.current.has(keyString)) continue;

        loadedOrLoadingTiles.current.add(keyString);
        pendingQueue.current.push({ key: tile, keyString });
      }

      processQueue(userPos);
    },
    [processQueue],
  );

  const onRegionChange = useCallback(
    (visibleBbox: BoundingBox, userPos: LatLon) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        requestTilesForRegion(visibleBbox, userPos);
      }, REGION_CHANGE_DEBOUNCE_MS);
    },
    [requestTilesForRegion],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      for (const controller of activeRequests.current.values()) {
        controller.abort();
      }
    };
  }, []);

  return {
    zones: zonesByName,
    onRegionChange,
  };
};
