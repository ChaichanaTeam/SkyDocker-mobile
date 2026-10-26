import {
  COLLAPSED_Y,
  EXPANDED_Y,
  HIDDEN_Y,
  styles,
} from "@/components/ui/map/MapScreen/styles/DroneInfoSheet.styles";
import { TextField } from "@/components/shared/ui/Text/TextField";
import { DroneInfoSheetProps } from "@/components/ui/map/MapScreen/types/types";
import { Button } from "@/components/shared/ui/Button/Button";
import { colors } from "@/theme";
import { CheckIn } from "@assets/icons";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";

type Snap = "hidden" | "collapsed" | "expanded";

const SNAP_Y: Record<Snap, number> = {
  expanded: EXPANDED_Y,
  collapsed: COLLAPSED_Y,
  hidden: HIDDEN_Y,
};
const SNAP_POINTS: Snap[] = ["expanded", "collapsed", "hidden"];

const EMPTY = "—";
const withUnit = (value: number | undefined, unit: string) =>
  value === undefined ? EMPTY : `${value}${unit}`;

export const DroneInfoSheet = ({
  drone,
  isVisible,
  onClose,
  onCheckInPress,
  onWikiPress,
  onProfilePress,
}: DroneInfoSheetProps) => {
  const translateY = useRef(new Animated.Value(HIDDEN_Y)).current;
  const currentY = useRef(HIDDEN_Y);
  const startY = useRef(HIDDEN_Y);
  const snapRef = useRef<Snap>("hidden");
  const onCloseRef = useRef(onClose);
  const [snap, setSnap] = useState<Snap>("hidden");

  onCloseRef.current = onClose;

  useEffect(() => {
    const id = translateY.addListener(({ value }) => {
      currentY.current = value;
    });
    return () => translateY.removeListener(id);
  }, [translateY]);

  const snapTo = useRef((target: Snap) => {
    const previous = snapRef.current;
    snapRef.current = target;
    setSnap(target);
    Animated.spring(translateY, {
      bounciness: 0,
      speed: 14,
      toValue: SNAP_Y[target],
      useNativeDriver: true,
    }).start();

    if (target === "hidden" && previous !== "hidden") onCloseRef.current();
  }).current;

  useEffect(() => {
    if (isVisible && snapRef.current === "hidden") snapTo("collapsed");
    if (!isVisible && snapRef.current !== "hidden") snapTo("hidden");
  }, [isVisible, snapTo]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        startY.current = currentY.current;
      },
      onPanResponderMove: (_, { dy }) => {
        const next = Math.min(
          Math.max(startY.current + dy, EXPANDED_Y),
          HIDDEN_Y,
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { vy }) => {
        const projected = currentY.current + vy * 150;
        const target = SNAP_POINTS.reduce((best, key) =>
          Math.abs(SNAP_Y[key] - projected) <
          Math.abs(SNAP_Y[best] - projected)
            ? key
            : best,
        );
        snapTo(target);
      },
    }),
  ).current;

  const collapsedOpacity = translateY.interpolate({
    extrapolate: "clamp",
    inputRange: [EXPANDED_Y, COLLAPSED_Y],
    outputRange: [0, 1],
  });
  const expandedOpacity = translateY.interpolate({
    extrapolate: "clamp",
    inputRange: [EXPANDED_Y, COLLAPSED_Y],
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
    { icon: "airplane-outline", label: "Check in", onPress: onCheckInPress },
    { icon: "book-outline", label: "Wiki", onPress: onWikiPress },
    { icon: "person-outline", label: "Profile", onPress: onProfilePress },
  ] as const;

  const droneName = drone?.name ?? EMPTY;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      pointerEvents={snap === "hidden" ? "none" : "auto"}
      style={[styles.sheet, { transform: [{ translateY }] }]}
    >
      <View style={styles.handle} />

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
        style={[styles.expanded, { opacity: expandedOpacity }]}
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
      </Animated.View>
    </Animated.View>
  );
};
