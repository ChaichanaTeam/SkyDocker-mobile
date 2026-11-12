import type { ConfigContext, ExpoConfig } from "expo/config";

const appBundleId = "com.gormanprog.skydocker";
const androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;
const iosGoogleMapsApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY;

const locationPermission =
  "SkyDocker uses your location while you use the app to show your current position on the map.";

const appConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "SkyDocker",
  slug: "SkyDocker",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "skydocker",
  userInterfaceStyle: "automatic",
  ios: {
    ...config.ios,
    bundleIdentifier: appBundleId,
    config: {
      ...config.ios?.config,
      ...(iosGoogleMapsApiKey ? { googleMapsApiKey: iosGoogleMapsApiKey } : {}),
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
    package: appBundleId,
    predictiveBackGestureEnabled: false,
  },
  web: {
    ...config.web,
    output: "static",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-splash-screen",
    "expo-secure-store",
    "expo-web-browser",
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
  extra: {
    ...config.extra,
    eas: {
      ...config.extra?.eas,
      projectId: "4c137ef6-5239-4dfc-9358-9573796c0e43",
    },
  },
});

export default appConfig;
