import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { fetchDemoCheckIns } from "@app/api/services/checkIn.service";
import type { BoundingBox } from "@app/api/types/geoZone";
import { CHECK_IN_MAP_DEBOUNCE_MS, OPEN_CHECK_IN_STATUSES } from "@features/tracking/constants/checkIn";
import { mapCheckInErrorToMessage } from "@features/tracking/mappers/checkInErrorMapper";
import type { CheckInMapMarker } from "@features/tracking/types/demoCheckIn";

const isForeground = (state: AppStateStatus | null) => state !== "background" && state !== "inactive";

export const useCheckInMap = () => {
  const [markers, setMarkers] = useState<CheckInMapMarker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const viewport = useRef<BoundingBox | null>(null);
  const focused = useRef(false);
  const appState = useRef(AppState.currentState);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invalidate = useCallback(() => {
    generation.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const refresh = useCallback(() => {
    invalidate();
    const boundingBox = viewport.current;
    if (!boundingBox || !focused.current || !isForeground(appState.current)) return;
    const requestGeneration = generation.current;
    setIsLoading(true);
    void fetchDemoCheckIns(boundingBox)
      .then(collection => {
        if (generation.current !== requestGeneration) return;
        setMarkers(collection.features
          .filter(feature => OPEN_CHECK_IN_STATUSES.has(feature.properties.status))
          .map((feature, index) => {
            const [longitude, latitude] = feature.geometry.coordinates;
            return {
              // The API has no feature IDs; keys distinguish records within each snapshot.
              key: `${longitude}:${latitude}:${feature.properties.start_at}:${index}`,
              coordinate: { longitude, latitude },
              properties: feature.properties,
            };
          }));
        setError(null);
      })
      .catch((caughtError: unknown) => {
        if (generation.current === requestGeneration) {
          setError(mapCheckInErrorToMessage(caughtError, "load"));
        }
      })
      .finally(() => {
        if (generation.current === requestGeneration) setIsLoading(false);
      });
  }, [invalidate]);

  const onRegionChange = useCallback((boundingBox: BoundingBox | null) => {
    invalidate();
    viewport.current = boundingBox;
    if (!boundingBox) {
      setMarkers([]);
      setError(null);
      setIsLoading(false);
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
        setIsLoading(false);
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
