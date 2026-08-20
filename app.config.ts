import type { ConfigContext, ExpoConfig } from "expo/config";

const androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
const iosGoogleMapsApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY;

const locationPermission =
  "SkyDocker uses your location while the map is open to show your current position.";

const appConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "SkyDocker",
  slug: "SkyDocker",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "skydocker",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    ...config.ios,
    bundleIdentifier: "com.gormanprog.skydocker",
    config: {
      ...config.ios?.config,
      ...(iosGoogleMapsApiKey
        ? { googleMapsApiKey: iosGoogleMapsApiKey }
        : {}),
    },
    supportsTablet: true,
  },
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      ...(androidGoogleMapsApiKey
        ? {
            googleMaps: {
              apiKey: androidGoogleMapsApiKey,
            },
          }
        : {}),
    },
    edgeToEdgeEnabled: true,
    package: "com.gormanprog.SkyDocker",
    predictiveBackGestureEnabled: false,
  },
  web: {
    ...config.web,
    output: "static",
  },
  plugins: [
    "expo-router",
    [
      "expo-location",
      {
        locationWhenInUsePermission: locationPermission,
      },
    ],
  ],
  experiments: {
    ...config.experiments,
    typedRoutes: true,
    reactCompiler: true,
  },
});

export default appConfig;
