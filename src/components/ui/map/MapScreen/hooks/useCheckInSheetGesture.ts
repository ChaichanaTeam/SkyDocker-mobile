import { useCallback, useEffect, useMemo } from "react";
import type { LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
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
} from "../constants/checkInSheet";

type UseCheckInSheetGestureParams = {
  isVisible: boolean;
  onClose: () => void;
  windowHeight: number;
};

export const useCheckInSheetGesture = ({
  isVisible,
  onClose,
  windowHeight,
}: UseCheckInSheetGestureParams) => {
  const sheetHeight = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragDismissing = useSharedValue(false);

  useEffect(() => {
    if (isVisible) {
      translateY.value = 0;
      isDragDismissing.value = false;
    }
  }, [isDragDismissing, isVisible, translateY]);

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
          translateY.value = withTiming(
            measuredSheetHeight,
            { duration: DISMISS_ANIMATION_DURATION_MS },
            (finished) => {
              if (finished) {
                scheduleOnRN(onClose);
              }
            },
          );
        })
        .onFinalize(() => {
          if (!isDragDismissing.value) {
            translateY.value = withSpring(0);
          }
        }),
    [isDragDismissing, onClose, sheetHeight, translateY, windowHeight],
  );

  return {
    dragGesture,
    handleSheetLayout,
    sheetAnimatedStyle,
  };
};
