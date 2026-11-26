import { TextField } from "@/components/shared/ui/Text/TextField";
import {
  DRONE_INFO_COLLAPSED_HEIGHT,
  DRONE_INFO_DETAILS_HEIGHT,
  DRONE_INFO_HIDDEN_OFFSET,
  DRONE_INFO_TOP_GAP,
} from "@/components/ui/map/MapScreen/constants/droneInfoSheet";
import { CHECK_IN_CHROME_HEIGHT } from "@/components/ui/map/MapScreen/constants/checkInSheet";
import { styles } from "@/components/ui/map/MapScreen/styles/DroneInfoSheet.styles";
import { tabsStyles } from "@/components/ui/map/MapScreen/styles/SheetTabs.styles";
import type {
  DroneInfoSheetProps,
  DroneInfoSheetSnap,
} from "@/components/ui/map/MapScreen/types/types";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckInForm } from "./CheckInForm";
import { SheetTabs } from "./SheetTabs";
import {
  getAvailableCheckInHeight,
  getCheckInSheetHeight,
} from "./utils/checkInSheetHeight";

const EMPTY = "—";
const withUnit = (value: number | undefined, unit: string) =>
  value === undefined ? EMPTY : `${value}${unit}`;

const SWIPE_SNAP_POINTS = ["expanded", "collapsed"] as const;

export const DroneInfoSheet = ({
  drone,
  isVisible,
  collapseToken,
  openCheckInToken,
  isMutationPending,
  onClose,
  onCheckInPress,
  checkIns,
  onWikiPress,
  onProfilePress,
  onDraftRangeChange,
}: DroneInfoSheetProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInContentHeight, setCheckInContentHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // iOS: the sheet is lifted by the keyboard height instead of KeyboardAvoidingView,
  // so the lift is applied once. Android resizes the window itself.
  const keyboardOffset = Platform.OS === "ios" ? keyboardHeight : 0;
  const availableCheckInHeight = getAvailableCheckInHeight({
    keyboardHeight: keyboardOffset,
    topGap: DRONE_INFO_TOP_GAP,
    topInset: insets.top,
    windowHeight,
  });
  const sheetHeight = showCheckIn
    ? checkInContentHeight > 0
      ? getCheckInSheetHeight({
          availableHeight: availableCheckInHeight,
          chromeHeight: CHECK_IN_CHROME_HEIGHT + Math.max(insets.bottom, 16),
          contentHeight: checkInContentHeight,
        })
      : availableCheckInHeight
    : DRONE_INFO_DETAILS_HEIGHT;
  const collapsedY = sheetHeight - DRONE_INFO_COLLAPSED_HEIGHT - insets.bottom;
  const snapY: Record<DroneInfoSheetSnap, number> = {
    expanded: 0,
    collapsed: collapsedY,
    hidden: sheetHeight + DRONE_INFO_HIDDEN_OFFSET,
  };
  const snapYRef = useRef(snapY);
  snapYRef.current = snapY;
  const previousCollapsedY = useRef(collapsedY);
  const translateY = useRef(new Animated.Value(collapsedY)).current;
  const currentY = useRef(collapsedY);
  const startY = useRef(collapsedY);
  const snapRef = useRef<DroneInfoSheetSnap>("collapsed");
  const onCloseRef = useRef(onClose);
  const [snap, setSnap] = useState<DroneInfoSheetSnap>("collapsed");

  onCloseRef.current = onClose;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

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
    if (collapseToken === undefined) return;
    if (snapRef.current !== "hidden") snapTo("collapsed");
    setShowCheckIn(false);
  }, [collapseToken, snapTo]);

  useEffect(() => {
    if (!openCheckInToken) return;
    setCheckInContentHeight(0);
    setShowCheckIn(true);
    snapTo("expanded");
  }, [openCheckInToken, snapTo]);

  useEffect(() => {
    if (previousCollapsedY.current !== collapsedY) {
      previousCollapsedY.current = collapsedY;
      if (snapRef.current === "collapsed") {
        translateY.setValue(collapsedY);
        currentY.current = collapsedY;
        startY.current = collapsedY;
      }
    }
  }, [collapsedY, translateY]);

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
          snapYRef.current.collapsed,
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { vy }) => {
        const projected = currentY.current + vy * 150;
        const target = SWIPE_SNAP_POINTS.reduce((best, key) =>
          Math.abs(snapYRef.current[key] - projected) <
          Math.abs(snapYRef.current[best] - projected)
            ? key
            : best,
        );
        snapTo(target);
      },
    }),
  ).current;

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
        setCheckInContentHeight(0);
        setShowCheckIn(true);
      },
    },
    { icon: "book-outline", label: "Wiki", onPress: onWikiPress },
    { icon: "person-outline", label: "Profile", onPress: onProfilePress },
  ] as const;

  const droneName = drone?.name ?? EMPTY;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.keyboardContainer, { bottom: keyboardOffset }]}
    >
      <Animated.View
        pointerEvents={snap === "hidden" ? "none" : "auto"}
        style={[
          styles.sheet,
          showCheckIn && styles.checkInSheet,
          { height: sheetHeight, transform: [{ translateY }] },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.handleTouchArea}>
          <View style={styles.handle} />
        </View>

        <Animated.View
          pointerEvents={snap === "expanded" ? "auto" : "none"}
          style={[
            styles.expanded,
            showCheckIn && styles.checkInExpanded,
            showCheckIn && { paddingBottom: Math.max(insets.bottom, 16) },
            { opacity: expandedOpacity },
          ]}
        >
          {showCheckIn ? (
            <View style={styles.tabsWrapper}>
              <SheetTabs
                active="checkin"
                onCheckInPress={onCheckInPress}
                onWikiPress={onWikiPress}
                onProfilePress={onProfilePress}
              />
            </View>
          ) : (
            <View style={tabsStyles.container}>
              {actions.map((action, index) => (
                <Pressable
                  key={action.label}
                  onPress={action.onPress}
                  style={[tabsStyles.tab, index > 0 && tabsStyles.tabDivider]}
                >
                  <Ionicons
                    color={
                      action.label === "Wiki" ? colors.startupLogo : colors.text5
                    }
                    name={action.icon}
                    size={14}
                  />
                  <TextField
                    style={[
                      tabsStyles.text,
                      action.label === "Wiki" && styles.actionTextEmphasized,
                    ]}
                  >
                    {action.label}
                  </TextField>
                </Pressable>
              ))}
            </View>
          )}

          {showCheckIn ? (
            <ScrollView
              contentContainerStyle={styles.formScrollContent}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={(_, height) => setCheckInContentHeight(height)}
              style={styles.formScroll}
            >
              <CheckInForm
                appearance="light"
                isCompactLayout={windowHeight < 700}
                isVisible={isVisible}
                isMutationPending={isMutationPending}
                checkIns={checkIns}
                onDraftRangeChange={onDraftRangeChange}
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
                <TextField style={styles.summaryLabel}>
                  Current Missions:{" "}
                </TextField>
                {drone?.currentMission ?? "None"}
              </TextField>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};
