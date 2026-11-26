import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { fetchCheckIns, resolveCountry } from "@app/api/services/checkIn.service";
import type { BoundingBox } from "@app/api/types/geoZone";
import { CHECK_IN_MAP_DEBOUNCE_MS, CHECK_IN_STATUS_CONFIG } from "@features/tracking/constants/checkIn";
import { mapCheckInErrorToMessage } from "@features/tracking/mappers/checkInErrorMapper";
import type { CheckInMapMarker } from "@features/tracking/types/checkInMap";

const isForeground = (state: AppStateStatus | null) => state !== "background" && state !== "inactive";

export const useCheckInMap = () => {
  const [markers, setMarkers] = useState<CheckInMapMarker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const viewport = useRef<{ box: BoundingBox; center: { lon: number; lat: number } } | null>(null);
  const country = useRef<string | null>(null);
  const focused = useRef(false);
  const appState = useRef(AppState.currentState);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invalidate = useCallback(() => {
    generation.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    invalidate();
    const currentViewport = viewport.current;
    if (!currentViewport || !focused.current || !isForeground(appState.current)) return;
    const requestGeneration = generation.current;
    setIsLoading(true);
    void resolveCountry(currentViewport.center.lon, currentViewport.center.lat)
      .then(tag => {
        if (generation.current !== requestGeneration) return null;
        if (country.current !== tag) {
          country.current = tag;
          setMarkers([]);
        }
        return fetchCheckIns(currentViewport.box, tag);
      })
      .then(collection => {
        if (generation.current !== requestGeneration || !collection) return;
        setMarkers(collection.features
          .filter(feature => CHECK_IN_STATUS_CONFIG[feature.properties.status].visible)
          .map((feature) => {
            const [longitude, latitude] = feature.geometry.coordinates;
            return {
              key: String(feature.properties.id),
              coordinate: { longitude, latitude },
              properties: feature.properties,
            };
          }));
        setError(null);
      })
      .catch((caughtError: unknown) => {
        if (generation.current === requestGeneration) {
          setMarkers([]);
          setError(mapCheckInErrorToMessage(caughtError, "load"));
        }
      })
      .finally(() => {
        if (generation.current === requestGeneration) setIsLoading(false);
      });
  }, [invalidate]);

  const onRegionChange = useCallback((boundingBox: BoundingBox | null, center?: { lon: number; lat: number }) => {
    invalidate();
    viewport.current = boundingBox && center ? { box: boundingBox, center } : null;
    if (!viewport.current) {
      setMarkers([]);
      setError(null);
    } else if (focused.current && isForeground(appState.current)) {
      timer.current = setTimeout(refresh, CHECK_IN_MAP_DEBOUNCE_MS);
    }
  }, [invalidate, refresh]);

  useFocusEffect(useCallback(() => {
    focused.current = true;
    appState.current = AppState.currentState;
    refresh();
    const subscription = AppState.addEventListener("change", nextState => {
      const previousState = appState.current;
      appState.current = nextState;
      if (!isForeground(nextState)) {
        invalidate();
      } else if (!isForeground(previousState)) {
        refresh();
      }
    });
    return () => {
      focused.current = false;
      invalidate();
      subscription.remove();
    };
  }, [invalidate, refresh]));

  return { markers, error, isLoading, onRegionChange, refresh };
};
