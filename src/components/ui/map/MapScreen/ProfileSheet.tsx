import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/hooks/useProfile";
import { SheetTabs } from "@/components/ui/map/MapScreen/SheetTabs";
import {
  ProfileSheetContent,
  type ProfileView,
} from "@/components/ui/map/MapScreen/profile/ProfileSheetContent";
import {
  PROFILE_HEIGHT,
  profileStyles as styles,
} from "@components/ui/map/MapScreen/styles/ProfileSheet.styles";

const VIEW_HEIGHT: Record<ProfileView, number> = {
  profile: PROFILE_HEIGHT,
  documents: 380,
  documentsList: 560,
  addDocuments: PROFILE_HEIGHT,
};

const VIEW_DEPTH: Record<ProfileView, number> = {
  profile: 0,
  documents: 1,
  documentsList: 2,
  addDocuments: 2,
};

const BACK_TARGET: Record<ProfileView, ProfileView | null> = {
  profile: null,
  documents: "profile",
  documentsList: "documents",
  addDocuments: "documents",
};

type Props = {
  onClose: () => void;
  onCheckInPress?: () => void;
  onWikiPress?: () => void;
  onSettingsPress?: () => void;
  onMyDronesPress?: () => void;
  onMissionPress?: () => void;
};

export const ProfileSheet = ({
  onClose,
  onCheckInPress,
  onWikiPress,
  onSettingsPress,
  onMyDronesPress,
  onMissionPress,
}: Props) => {
  const [view, setView] = useState<ProfileView>("profile");
  const { data: profile, loading: profileLoading } = useProfile();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const expandedHeight = Math.max(0, windowHeight - insets.top - 8);
  const collapsedHeight = Math.min(VIEW_HEIGHT[view], expandedHeight);
  const maxTranslateY = expandedHeight - collapsedHeight;
  const translateY = useRef(new Animated.Value(maxTranslateY)).current;
  const currentY = useRef(maxTranslateY);
  const startY = useRef(maxTranslateY);
  const maxTranslateYRef = useRef(maxTranslateY);
  const exitTranslateYRef = useRef(expandedHeight + insets.bottom + 24);
  const onCloseRef = useRef(onClose);
  const isClosingRef = useRef(false);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const prevView = useRef<ProfileView>(view);

  maxTranslateYRef.current = maxTranslateY;
  exitTranslateYRef.current = expandedHeight + insets.bottom + 24;
  onCloseRef.current = onClose;

  const goBack = () => {
    const target = BACK_TARGET[view];
    if (target) setView(target);
  };

  useEffect(() => {
    const listenerId = translateY.addListener(({ value }) => {
      currentY.current = value;
    });
    return () => translateY.removeListener(listenerId);
  }, [translateY]);

  const closeWithAnimation = useRef(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    Animated.timing(translateY, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
      toValue: exitTranslateYRef.current,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onCloseRef.current();
    });
  }).current;

  useEffect(() => {
    if (isClosingRef.current) return;
    const target = currentY.current <= 1 ? 0 : maxTranslateY;
    Animated.spring(translateY, {
      bounciness: 0,
      speed: 14,
      toValue: target,
      useNativeDriver: true,
    }).start();
  }, [maxTranslateY, translateY]);

  useEffect(() => {
    if (prevView.current === view) return;
    const forward = VIEW_DEPTH[view] > VIEW_DEPTH[prevView.current];
    prevView.current = view;

    fade.setValue(0);
    slide.setValue(forward ? 24 : -24);
    Animated.parallel([
      Animated.timing(fade, {
        duration: 180,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [view, fade, slide]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderGrant: () => {
        if (isClosingRef.current) return;
        translateY.stopAnimation();
        startY.current = currentY.current;
      },
      onPanResponderMove: (_, { dy }) => {
        if (isClosingRef.current) return;
        const next = Math.min(
          Math.max(startY.current + dy, 0),
          exitTranslateYRef.current,
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isClosingRef.current) return;
        const maxY = maxTranslateYRef.current;
        const projectedY = currentY.current + vy * 150;
        if (dy > 120 || projectedY > maxY + 80) {
          closeWithAnimation();
          return;
        }

        const target = projectedY > maxY / 2 ? maxY : 0;
        Animated.spring(translateY, {
          bounciness: 0,
          speed: 14,
          toValue: target,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.sheet,
        { height: expandedHeight, transform: [{ translateY }] },
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.handleArea}>
        <View style={styles.handle} />
      </View>

      <View style={styles.tabsWrapper}>
        <SheetTabs
          active="profile"
          onCheckInPress={onCheckInPress}
          onWikiPress={onWikiPress}
          onProfilePress={closeWithAnimation}
        />
      </View>

      <ScrollView
        automaticallyAdjustKeyboardInsets
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 24 + insets.bottom },
        ]}
        style={[styles.content, { marginBottom: maxTranslateY }]}
      >
        <ProfileSheetContent
          fade={fade}
          onAddDocumentDone={() => setView("documents")}
          onBack={goBack}
          onDocumentsPress={() => setView("documents")}
          onMissionPress={onMissionPress}
          onMyDronesPress={onMyDronesPress}
          onOpenAddDocuments={() => setView("addDocuments")}
          onOpenDocumentsList={() => setView("documentsList")}
          onSettingsPress={onSettingsPress}
          profile={profile}
          profileLoading={profileLoading}
          slide={slide}
          view={view}
        />
      </ScrollView>
    </Animated.View>
  );
};
