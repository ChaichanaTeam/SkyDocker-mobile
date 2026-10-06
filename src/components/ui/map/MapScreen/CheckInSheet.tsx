import { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckInForm } from "./CheckInForm";
import { useCheckInSheetGesture } from "./hooks/useCheckInSheetGesture";
import { styles } from "./styles/CheckInSheet.styles";

import type { CheckInSheetProps } from "./types/types";

export const CheckInSheet = ({
  appearance,
  isVisible,
  onClose,
  onSubmit,
}: CheckInSheetProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const isCompactLayout = windowHeight < 700;

  const handleClose = useCallback((): void => {
    onClose();
  }, [onClose]);
  const {
    dragGesture,
    handleSheetLayout,
    sheetAnimatedStyle,
  } = useCheckInSheetGesture({
    isVisible,
    onClose: handleClose,
    windowHeight,
  });

  const handleAccessibilityAction = useCallback(
    (event: { nativeEvent: { actionName: string } }): void => {
      if (event.nativeEvent.actionName === "dismiss") {
        handleClose();
      }
    },
    [handleClose],
  );

  return (
    <Modal
      animationType="slide"
      navigationBarTranslucent
      onRequestClose={handleClose}
      statusBarTranslucent
      transparent
      visible={isVisible}
    >
      <GestureHandlerRootView style={styles.gestureRoot}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalRoot}
        >
          <Pressable
            accessibilityLabel="Close check-in sheet"
            onPress={handleClose}
            style={styles.backdrop}
          />
          <Animated.View
            onLayout={handleSheetLayout}
            style={[
              styles.sheet,
              appearance === "light" ? styles.sheetLight : styles.sheetDark,
              { paddingBottom: Math.max(insets.bottom, 16) },
              sheetAnimatedStyle,
            ]}
          >
            <GestureDetector gesture={dragGesture}>
              <View
                accessibilityActions={[
                  { label: "Dismiss check-in sheet", name: "dismiss" },
                ]}
                accessibilityHint="Drag down to dismiss the check-in sheet"
                accessibilityLabel="Dismiss check-in sheet"
                accessibilityRole="button"
                accessible
                onAccessibilityAction={handleAccessibilityAction}
                style={[
                  styles.handleTouchArea,
                  isCompactLayout ? styles.handleTouchAreaCompact : null,
                ]}
              >
                <View style={styles.handle} />
              </View>
            </GestureDetector>
            <CheckInForm
              appearance={appearance}
              isCompactLayout={isCompactLayout}
              isVisible={isVisible}
              onSubmit={onSubmit}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};
