import { useFocusEffect } from "@react-navigation/native";
import {
  Accuracy,
  getForegroundPermissionsAsync,
  getCurrentPositionAsync,
  hasServicesEnabledAsync,
  PermissionStatus,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import { useCallback, useState } from "react";

import type {
  LocationObject,
  LocationPermissionResponse,
  LocationSubscription,
} from "expo-location";

import type {
  FocusedForegroundLocationState,
  TrackingErrorState,
  TrackingPermissionState,
  UserCoordinates,
} from "./types/types";

import {
  currentPositionFailedMessage,
  deniedPermissionMessage,
  disabledServicesMessage,
  watchFailedMessage,
} from "./constants/locationMessages";

const toUserCoordinates = (location: LocationObject): UserCoordinates => ({
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
});

const toPermissionState = (
  response: LocationPermissionResponse,
): TrackingPermissionState => ({
  canAskAgain: response.canAskAgain,
  granted: response.status === PermissionStatus.GRANTED,
});

export const useFocusedForegroundLocation =
  (): FocusedForegroundLocationState => {
    const [error, setError] = useState<TrackingErrorState | null>(null);
    const [isLocating, setIsLocating] = useState<boolean>(true);
    const [permission, setPermission] = useState<TrackingPermissionState>({
      canAskAgain: true,
      granted: false,
    });
    const [retryCount, setRetryCount] = useState<number>(0);
    const [userCoordinates, setUserCoordinates] =
      useState<UserCoordinates | null>(null);

    const retry = useCallback((): void => {
      setRetryCount((currentRetryCount) => currentRetryCount + 1);
    }, []);

    const ensureLocationAccess = useCallback(async (): Promise<void> => {
      const existingPermission = await getForegroundPermissionsAsync();
      let nextPermission = toPermissionState(existingPermission);
      setPermission(nextPermission);

      if (!nextPermission.granted && existingPermission.canAskAgain) {
        const requestedPermission = await requestForegroundPermissionsAsync();
        nextPermission = toPermissionState(requestedPermission);
        setPermission(nextPermission);
      }

      if (!nextPermission.granted) {
        setError({
          message: deniedPermissionMessage,
          reason: "permission-denied",
        });
        throw new Error(deniedPermissionMessage);
      }

      const areServicesEnabled = await hasServicesEnabledAsync();

      if (!areServicesEnabled) {
        setError({
          message: disabledServicesMessage,
          reason: "services-disabled",
        });
        throw new Error(disabledServicesMessage);
      }
    }, []);

    const getFreshCoordinates = useCallback(async (): Promise<UserCoordinates> => {
      try {
        await ensureLocationAccess();
        const currentPosition = await getCurrentPositionAsync({
          accuracy: Accuracy.High,
        });
        const nextCoordinates = toUserCoordinates(currentPosition);

        setUserCoordinates(nextCoordinates);
        setError(null);

        return nextCoordinates;
      } catch (error: unknown) {
        const caughtMessage = error instanceof Error ? error.message : null;
        const message =
          caughtMessage === deniedPermissionMessage ||
          caughtMessage === disabledServicesMessage
            ? caughtMessage
            : currentPositionFailedMessage;

        setError({
          message,
          reason:
            message === deniedPermissionMessage
              ? "permission-denied"
              : message === disabledServicesMessage
                ? "services-disabled"
                : "current-position-failed",
        });

        throw new Error(message);
      }
    }, [ensureLocationAccess]);

    useFocusEffect(
      useCallback(() => {
        let isActive = true;
        let locationSubscription: LocationSubscription | null = null;

        const applyPermission = (
          response: LocationPermissionResponse,
        ): boolean => {
          const nextPermission = toPermissionState(response);

          if (!isActive) {
            return false;
          }

          setPermission(nextPermission);

          return nextPermission.granted;
        };

        const startLocationWatch = async (
          currentRetryCount: number,
        ): Promise<void> => {
          const shouldStartLocating = currentRetryCount >= 0;

          if (isActive) {
            setIsLocating(shouldStartLocating);
            setError(null);
          }

          const existingPermission = await getForegroundPermissionsAsync();
          let isPermissionGranted = applyPermission(existingPermission);

          if (!isPermissionGranted && existingPermission.canAskAgain) {
            const requestedPermission =
              await requestForegroundPermissionsAsync();
            isPermissionGranted = applyPermission(requestedPermission);
          }

          if (!isPermissionGranted) {
            if (isActive) {
              setError({
                message: deniedPermissionMessage,
                reason: "permission-denied",
              });
              setIsLocating(false);
            }

            return;
          }

          const areServicesEnabled = await hasServicesEnabledAsync();

          if (!areServicesEnabled) {
            if (isActive) {
              setError({
                message: disabledServicesMessage,
                reason: "services-disabled",
              });
              setIsLocating(false);
            }

            return;
          }

          const nextLocationSubscription = await watchPositionAsync(
            {
              accuracy: Accuracy.Balanced,
              distanceInterval: 10,
              timeInterval: 5000,
            },
            (location) => {
              if (!isActive) {
                return;
              }

              setUserCoordinates(toUserCoordinates(location));
              setError(null);
              setIsLocating(false);
            },
            () => {
              if (!isActive) {
                return;
              }

              setError({
                message: watchFailedMessage,
                reason: "watch-failed",
              });
              setIsLocating(false);
            },
          );

          if (!isActive) {
            nextLocationSubscription.remove();
            return;
          }

          locationSubscription = nextLocationSubscription;
        };

        startLocationWatch(retryCount).catch((caughtError: unknown) => {
          if (!isActive) {
            return;
          }

          const message =
            caughtError instanceof Error
              ? caughtError.message
              : watchFailedMessage;

          setError({
            message,
            reason: "watch-failed",
          });
          setIsLocating(false);
        });

        return () => {
          isActive = false;
          locationSubscription?.remove();
        };
      }, [retryCount]),
    );

    return {
      error,
      getFreshCoordinates,
      isLocating,
      permission,
      retry,
      userCoordinates,
    };
  };
