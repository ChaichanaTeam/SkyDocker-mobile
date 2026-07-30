import { useWindowDimensions, View } from "react-native";

import { LoadingSpinner } from "@/components/ui/auth/LoadingSpiner/LoadingSpinner";

import { BrandWordmark } from "@/features/startup/components/BrandWordmark";
import { styles } from "@/features/startup/styles/AppSplashScreen.styles";
import { getStartupMetrics } from "@/features/startup/utils/startupScale";

export type AppSplashScreenProps = {
  phase: "brand" | "loading";
};

export function AppSplashScreen({ phase }: AppSplashScreenProps) {
  const { width } = useWindowDimensions();
  const metrics = getStartupMetrics(width);

  return (
    <View style={styles.container}>
      {phase === "brand" ? (
        <BrandWordmark viewportWidth={width} />
      ) : (
        <LoadingSpinner
          size={metrics.spinnerSize}
          strokeWidth={metrics.spinnerStrokeWidth}
        />
      )}
    </View>
  );
}
