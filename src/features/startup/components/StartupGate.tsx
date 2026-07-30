import {
  Inter_400Regular,
  Inter_500Medium,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { AppSplashScreen } from "@/features/startup/components/AppSplashScreen";
import {
  getStartupPhase,
  STARTUP_BRAND_DURATION_MS,
  STARTUP_LOADING_DURATION_MS,
  StartupPhase,
} from "@/features/startup/hooks/startupTiming";

export type StartupGateProps = PropsWithChildren<{
  bootstrap?: () => Promise<void>;
  brandDurationMs?: number;
  loadingDurationMs?: number;
}>;

const DEFAULT_BOOTSTRAP = async () => {};

export function StartupGate({
  bootstrap = DEFAULT_BOOTSTRAP,
  brandDurationMs = STARTUP_BRAND_DURATION_MS,
  loadingDurationMs = STARTUP_LOADING_DURATION_MS,
  children,
}: StartupGateProps) {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });
  const [bootstrapComplete, setBootstrapComplete] = useState(false);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const resourcesReady = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (fontError && __DEV__) {
      console.warn(
        "Startup font failed to load; continuing with platform fallback.",
        fontError,
      );
    }
  }, [fontError]);

  useEffect(() => {
    let mounted = true;

    bootstrap()
      .catch((error: unknown) => {
        if (__DEV__) {
          console.warn(
            "Startup bootstrap failed; continuing to app shell.",
            error,
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setBootstrapComplete(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [bootstrap]);

  useEffect(() => {
    if (!resourcesReady || nativeSplashHidden) {
      return;
    }

    SplashScreen.hideAsync()
      .catch((error: unknown) => {
        if (__DEV__) {
          console.warn("Unable to hide native splash screen.", error);
        }
      })
      .finally(() => {
        setNativeSplashHidden(true);
      });
  }, [nativeSplashHidden, resourcesReady]);

  useEffect(() => {
    if (!nativeSplashHidden) {
      return;
    }

    const startedAt = Date.now();
    const updateElapsed = () => setElapsedMs(Date.now() - startedAt);
    const interval = setInterval(updateElapsed, 100);
    const brandBoundary = setTimeout(updateElapsed, brandDurationMs);
    const loadingBoundary = setTimeout(
      updateElapsed,
      brandDurationMs + loadingDurationMs,
    );

    updateElapsed();

    return () => {
      clearInterval(interval);
      clearTimeout(brandBoundary);
      clearTimeout(loadingBoundary);
    };
  }, [brandDurationMs, loadingDurationMs, nativeSplashHidden]);

  const phase: StartupPhase = useMemo(() => {
    if (!nativeSplashHidden) {
      return "nativeSplash";
    }

    return getStartupPhase({
      elapsedMs,
      bootstrapComplete,
      brandDurationMs,
      loadingDurationMs,
    });
  }, [
    bootstrapComplete,
    brandDurationMs,
    elapsedMs,
    loadingDurationMs,
    nativeSplashHidden,
  ]);

  if (phase === "nativeSplash") {
    return null;
  }

  if (phase === "ready") {
    return children;
  }

  return <AppSplashScreen phase={phase} />;
}
