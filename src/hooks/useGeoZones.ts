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
const FLUSH_DELAY_MS = 150;

interface TileRequest {
  key: TileKey;
  keyString: string;
  priority: 0 | 1;
}

export const useGeoZones = () => {
  const [zonesByTag, setZonesByTag] = useState<Map<string, GeoZoneFeature>>(
    new Map(),
  );

  const loadedOrLoadingTiles = useRef<Set<string>>(new Set());
  const pendingQueue = useRef<TileRequest[]>([]);
  const activeRequests = useRef<Map<string, AbortController>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buffer = useRef<GeoZoneFeature[]>([]);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleFlush = useCallback(() => {
    if (flushTimer.current) return;

    flushTimer.current = setTimeout(() => {
      flushTimer.current = null;
      const batch = buffer.current;
      buffer.current = [];

      setZonesByTag((prev) => {
        let next: Map<string, GeoZoneFeature> | null = null;
        for (const feature of batch) {
          if (prev.has(feature.properties.tag)) continue;
          next ??= new Map(prev);
          next.set(feature.properties.tag, feature);
        }
        return next ?? prev;
      });
    }, FLUSH_DELAY_MS);
  }, []);

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
            buffer.current.push(...collection.features);
            scheduleFlush();
          })
          .catch((e: unknown) => {
            const name = (e as { name?: string } | null)?.name;

            if (name === "AbortError") {
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
    [scheduleFlush],
  );

  const requestTilesForRegion = useCallback(
    (visibleBbox: BoundingBox, userPos: LatLon) => {
      const visibleTiles = tilesInBoundingBox(visibleBbox);
      const visibleKeys = new Set(visibleTiles.map(tileKeyToString));
      const wanted = neighborTiles(visibleTiles);
      const wantedKeys = new Set(wanted.map(tileKeyToString));

      pendingQueue.current = pendingQueue.current.filter((item) => {
        if (wantedKeys.has(item.keyString)) return true;
        loadedOrLoadingTiles.current.delete(item.keyString);
        return false;
      });

      for (const [keyString, controller] of activeRequests.current) {
        if (!wantedKeys.has(keyString)) controller.abort();
      }

      for (const tile of wanted) {
        const keyString = tileKeyToString(tile);
        if (loadedOrLoadingTiles.current.has(keyString)) continue;

        loadedOrLoadingTiles.current.add(keyString);
        pendingQueue.current.push({
          key: tile,
          keyString,
          priority: visibleKeys.has(keyString) ? 0 : 1,
        });
      }

      pendingQueue.current.sort((a, b) => a.priority - b.priority);
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
      if (flushTimer.current) clearTimeout(flushTimer.current);
      for (const controller of activeRequests.current.values()) {
        controller.abort();
      }
    };
  }, []);

  return {
    zones: zonesByTag,
    onRegionChange,
  };
};
