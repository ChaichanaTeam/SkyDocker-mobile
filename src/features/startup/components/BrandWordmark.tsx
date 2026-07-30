import { Text, useWindowDimensions } from "react-native";

import { styles } from "@/features/startup/styles/BrandWordmark.styles";
import { getStartupMetrics } from "@/features/startup/utils/startupScale";

export type BrandWordmarkProps = {
  viewportWidth?: number;
};

export function BrandWordmark({ viewportWidth }: BrandWordmarkProps) {
  const { width } = useWindowDimensions();
  const metrics = getStartupMetrics(viewportWidth ?? width);

  return (
    <Text
      accessibilityLabel="SkyDocker"
      maxFontSizeMultiplier={1}
      numberOfLines={1}
      style={[
        styles.text,
        {
          fontSize: metrics.logoFontSize,
          lineHeight: metrics.logoLineHeight,
        },
      ]}
    >
      SkyDocker
    </Text>
  );
}
