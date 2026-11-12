import { Stack } from "expo-router";
import { requestForegroundPermissionsAsync } from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { StartupGate } from "@/features/startup";

const requestLocationPermission = async (): Promise<void> => {
  await requestForegroundPermissionsAsync();
};

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <StartupGate bootstrap={requestLocationPermission}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "SkyDocker" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </StartupGate>
  );
}
