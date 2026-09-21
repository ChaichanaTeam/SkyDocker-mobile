export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export type TrackingErrorReason =
  | "permission-denied"
  | "services-disabled"
  | "current-position-failed"
  | "watch-failed";

export type TrackingErrorState = {
  message: string;
  reason: TrackingErrorReason;
};

export type TrackingPermissionState = {
  canAskAgain: boolean;
  granted: boolean;
};

export type FocusedForegroundLocationState = {
  error: TrackingErrorState | null;
  getFreshCoordinates: () => Promise<UserCoordinates>;
  isLocating: boolean;
  permission: TrackingPermissionState;
  retry: () => void;
  userCoordinates: UserCoordinates | null;
};
