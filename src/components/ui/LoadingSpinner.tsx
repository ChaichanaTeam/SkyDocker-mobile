import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, ViewStyle } from 'react-native';

import { colors } from '@/theme';

import { styles } from './LoadingSpinner.styles';

export type LoadingSpinnerProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function LoadingSpinner({
  size = 112,
  strokeWidth = 5,
  color = colors.startupSpinner,
  accessibilityLabel = 'Loading application',
}: LoadingSpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReduceMotionEnabled(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotionEnabled);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotionEnabled) {
      rotation.stopAnimation();
      return;
    }

    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [reduceMotionEnabled, rotation]);

  const spinnerStyle: Animated.WithAnimatedObject<ViewStyle> = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: strokeWidth,
    borderColor: color,
    borderLeftColor: 'transparent',
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      style={[styles.ring, spinnerStyle]}
    />
  );
}
