import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import type { LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  DISMISS_ANIMATION_DURATION_MS,
  DISMISS_DISTANCE_RATIO,
  DISMISS_VELOCITY_Y,
} from "@/components/ui/map/MapScreen/constants/checkInSheet";
import type { UseCheckInSheetGestureParams } from "@/components/ui/map/MapScreen/types/useCheckInSheetGesture";

export const useCheckInSheetGesture = ({
  isVisible,
  onClose,
  resetKey = null,
  windowHeight,
}: UseCheckInSheetGestureParams) => {
  const onCloseRef = useRef(onClose);
  const revisionRef = useRef(0);
  const gestureRevision = useSharedValue(0);
  const sheetHeight = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragDismissing = useSharedValue(false);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    revisionRef.current += 1;
    gestureRevision.value = revisionRef.current;
    cancelAnimation(translateY);
    translateY.value = 0;
    isDragDismissing.value = false;

    return () => {
      revisionRef.current += 1;
      cancelAnimation(translateY);
    };
  }, [gestureRevision, isDragDismissing, isVisible, resetKey, translateY]);

  const closeFromGesture = useCallback((revision: number): void => {
    if (revision === revisionRef.current) {
      onCloseRef.current();
    }
  }, []);

  const handleSheetLayout = useCallback(
    (event: LayoutChangeEvent): void => {
      sheetHeight.value = event.nativeEvent.layout.height;
    },
    [sheetHeight],
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const dragGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          translateY.value = Math.max(event.translationY, 0);
        })
        .onEnd((event) => {
          const measuredSheetHeight = sheetHeight.value || windowHeight * 0.6;
          const dismissDistance =
            measuredSheetHeight * DISMISS_DISTANCE_RATIO;
          const shouldDismiss =
            event.translationY >= dismissDistance ||
            event.velocityY >= DISMISS_VELOCITY_Y;

          if (!shouldDismiss) {
            translateY.value = withSpring(0);
            return;
          }

          if (isDragDismissing.value) {
            return;
          }

          isDragDismissing.value = true;
          const revision = gestureRevision.value;
          translateY.value = withTiming(
            measuredSheetHeight,
            { duration: DISMISS_ANIMATION_DURATION_MS },
            (finished) => {
              if (finished) {
                scheduleOnRN(closeFromGesture, revision);
              }
            },
          );
        })
        .onFinalize(() => {
          if (!isDragDismissing.value) {
            translateY.value = withSpring(0);
          }
        }),
    [
      closeFromGesture,
      gestureRevision,
      isDragDismissing,
      sheetHeight,
      translateY,
      windowHeight,
    ],
  );

  return {
    dragGesture,
    handleSheetLayout,
    sheetAnimatedStyle,
  };
};
