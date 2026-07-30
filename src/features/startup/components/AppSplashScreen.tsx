import { useWindowDimensions, View } from 'react-native';

import { LoadingSpinner } from '../../../components/ui/auth/LoadingSpiner/LoadingSpinner';

import { styles } from '../styles/AppSplashScreen.styles';
import { getStartupMetrics } from '../utils/startupScale';
import { BrandWordmark } from './BrandWordmark';

export type AppSplashScreenProps = {
  phase: 'brand' | 'loading';
};

export function AppSplashScreen({ phase }: AppSplashScreenProps) {
  const { width } = useWindowDimensions();
  const metrics = getStartupMetrics(width);

  return (
    <View style={styles.container}>
      {phase === 'brand' ? (
        <BrandWordmark viewportWidth={width} />
      ) : (
        <LoadingSpinner size={metrics.spinnerSize} strokeWidth={metrics.spinnerStrokeWidth} />
      )}
    </View>
  );
}
