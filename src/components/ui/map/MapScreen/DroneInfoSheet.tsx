import { styles } from "@/components/ui/map/MapScreen/styles/DroneInfoSheet.styles";
import { TextField } from "@/components/shared/ui/Text/TextField";
import {
  DRONE_INFO_COLLAPSED_HEIGHT,
  DRONE_INFO_DETAILS_HEIGHT,
  DRONE_INFO_FORM_MAX_HEIGHT,
  DRONE_INFO_HIDDEN_OFFSET,
  DRONE_INFO_SNAP_POINTS,
  DRONE_INFO_TOP_GAP,
} from "@/components/ui/map/MapScreen/constants/droneInfoSheet";
import type {
  DroneInfoSheetProps,
  DroneInfoSheetSnap,
} from "@/components/ui/map/MapScreen/types/types";
import { Button } from "@/components/shared/ui/Button/Button";
import { colors } from "@/theme";
import { CheckIn } from "@assets/icons";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckInForm } from "./CheckInForm";

const EMPTY = "—";
const withUnit = (value: number | undefined, unit: string) =>
  value === undefined ? EMPTY : `${value}${unit}`;

export const DroneInfoSheet = ({
  drone,
  isVisible,
  isMutationPending,
  onClose,
  onCheckInPress,
  onSubmit,
  onWikiPress,
  onProfilePress,
}: DroneInfoSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const sheetHeight = showCheckIn
    ? Math.min(
        windowHeight - insets.top - DRONE_INFO_TOP_GAP,
        DRONE_INFO_FORM_MAX_HEIGHT,
      )
    : DRONE_INFO_DETAILS_HEIGHT;
  const snapY: Record<DroneInfoSheetSnap, number> = {
    expanded: 0,
    collapsed: sheetHeight - DRONE_INFO_COLLAPSED_HEIGHT,
    hidden: sheetHeight + DRONE_INFO_HIDDEN_OFFSET,
  };
  const snapYRef = useRef(snapY);
  snapYRef.current = snapY;
  const previousSheetHeight = useRef(sheetHeight);
  const translateY = useRef(
    new Animated.Value(
      DRONE_INFO_DETAILS_HEIGHT + DRONE_INFO_HIDDEN_OFFSET,
    ),
  ).current;
  const currentY = useRef(
    DRONE_INFO_DETAILS_HEIGHT + DRONE_INFO_HIDDEN_OFFSET,
  );
  const startY = useRef(
    DRONE_INFO_DETAILS_HEIGHT + DRONE_INFO_HIDDEN_OFFSET,
  );
  const snapRef = useRef<DroneInfoSheetSnap>("hidden");
  const onCloseRef = useRef(onClose);
  const [snap, setSnap] = useState<DroneInfoSheetSnap>("hidden");

  onCloseRef.current = onClose;

  useEffect(() => {
    const id = translateY.addListener(({ value }) => {
      currentY.current = value;
    });
    return () => translateY.removeListener(id);
  }, [translateY]);

  const snapTo = useRef((target: DroneInfoSheetSnap) => {
    const previous = snapRef.current;
    snapRef.current = target;
    setSnap(target);
    Animated.spring(translateY, {
      bounciness: 0,
      speed: 14,
      toValue: snapYRef.current[target],
      useNativeDriver: true,
    }).start();

    if (target === "hidden" && previous !== "hidden") onCloseRef.current();
  }).current;

  useEffect(() => {
    if (isVisible && snapRef.current === "hidden") snapTo("collapsed");
    if (!isVisible) {
      if (snapRef.current !== "hidden") snapTo("hidden");
      setShowCheckIn(false);
    }
  }, [isVisible, snapTo]);

  useEffect(() => {
    if (previousSheetHeight.current !== sheetHeight) {
      previousSheetHeight.current = sheetHeight;
      if (snapRef.current === "collapsed") {
        translateY.setValue(snapYRef.current.collapsed);
      }
    }
  }, [sheetHeight, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        startY.current = currentY.current;
      },
      onPanResponderMove: (_, { dy }) => {
        const next = Math.min(
          Math.max(startY.current + dy, snapYRef.current.expanded),
          snapYRef.current.hidden,
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { vy }) => {
        const projected = currentY.current + vy * 150;
        const target = DRONE_INFO_SNAP_POINTS.reduce((best, key) =>
          Math.abs(snapYRef.current[key] - projected) <
          Math.abs(snapYRef.current[best] - projected)
            ? key
            : best,
        );
        snapTo(target);
      },
    }),
  ).current;

  const collapsedOpacity = translateY.interpolate({
    extrapolate: "clamp",
    inputRange: [snapY.expanded, snapY.collapsed],
    outputRange: [0, 1],
  });
  const expandedOpacity = translateY.interpolate({
    extrapolate: "clamp",
    inputRange: [snapY.expanded, snapY.collapsed],
    outputRange: [1, 0],
  });

  const specs = [
    {
      icon: "speedometer-outline",
      text: `Speed: ${withUnit(drone?.speedKmh, "km/h")}`,
    },
    {
      icon: "barbell-outline",
      text: `Weight: ${withUnit(drone?.weightG, "g")}`,
    },
    {
      icon: "resize-outline",
      text: `Height: ${withUnit(drone?.heightKm, "km")}`,
    },
    {
      icon: "navigate-outline",
      text: `Range: ${withUnit(drone?.rangeKm, "km")}`,
    },
  ] as const;

  const actions = [
    {
      icon: "airplane-outline",
      label: "Check in",
      onPress: () => {
        onCheckInPress();
        setShowCheckIn(true);
      },
    },
    { icon: "book-outline", label: "Wiki", onPress: onWikiPress },
    { icon: "person-outline", label: "Profile", onPress: onProfilePress },
  ] as const;

  const droneName = drone?.name ?? EMPTY;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      pointerEvents="box-none"
      style={styles.keyboardContainer}
    >
      <Animated.View
        pointerEvents={snap === "hidden" ? "none" : "auto"}
        style={[styles.sheet, { height: sheetHeight, transform: [{ translateY }] }]}
      >
        <View {...panResponder.panHandlers} style={styles.handleTouchArea}>
          <View style={styles.handle} />
        </View>

        <Animated.View
          pointerEvents={snap === "collapsed" ? "auto" : "none"}
          style={[styles.collapsed, { opacity: collapsedOpacity }]}
        >
          <View style={styles.summaryRow}>
            <TextField style={styles.summaryText}>
              <TextField style={styles.summaryLabel}>Missions: </TextField>
              {drone?.missionsCount ?? "None"}
            </TextField>
            <TextField style={styles.summaryText}>
              <TextField style={styles.summaryLabel}>Flight Time: </TextField>
              {drone?.flightTime ?? "None"}
            </TextField>
          </View>
          <TextField style={styles.droneName}>{droneName}</TextField>
        </Animated.View>

        <Animated.View
          pointerEvents={snap === "expanded" ? "auto" : "none"}
          style={[
            styles.expanded,
            showCheckIn && { paddingBottom: Math.max(insets.bottom, 16) },
            { opacity: expandedOpacity },
          ]}
        >
          <View style={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={action.label}
                onPress={action.onPress}
                size="small"
                style={[styles.action, index > 0 && styles.actionDivider]}
                variant="text"
              >
                {action.label === "Check in" ? (
                  <CheckIn height={16} width={16} />
                ) : (
                  <Ionicons
                    color={action.label === "Wiki" ? colors.startupLogo : colors.text5}
                    name={action.icon}
                    size={16}
                  />
                )}
                <TextField
                  style={[
                    styles.actionText,
                    action.label === "Wiki" && styles.actionTextEmphasized,
                  ]}
                >
                  {action.label}
                </TextField>
              </Button>
            ))}
          </View>

          {showCheckIn ? (
            <ScrollView
              contentContainerStyle={styles.formScrollContent}
              keyboardShouldPersistTaps="handled"
              style={styles.formScroll}
            >
              <CheckInForm
                appearance="light"
                isCompactLayout={windowHeight < 700}
                isVisible={isVisible}
                isMutationPending={isMutationPending}
                onSubmit={onSubmit}
              />
            </ScrollView>
          ) : (
            <>
              <View style={styles.imageCard}>
                <Ionicons color={colors.text5} name="airplane" size={56} />
              </View>

              <TextField style={styles.droneName}>{droneName}</TextField>

              <View style={styles.specsGrid}>
                {specs.map((spec) => (
                  <View key={spec.text} style={styles.specItem}>
                    <Ionicons color={colors.text5} name={spec.icon} size={16} />
                    <TextField style={styles.specText}>{spec.text}</TextField>
                  </View>
                ))}
              </View>

              <TextField style={styles.currentMission}>
                <TextField style={styles.summaryLabel}>Current Missions: </TextField>
                {drone?.currentMission ?? "None"}
              </TextField>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};
