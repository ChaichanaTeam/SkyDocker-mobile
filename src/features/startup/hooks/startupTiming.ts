export type StartupPhase = 'nativeSplash' | 'brand' | 'loading' | 'ready';

export type StartupTimingInput = {
  elapsedMs: number;
  bootstrapComplete: boolean;
  brandDurationMs?: number;
  loadingDurationMs?: number;
};

export const STARTUP_BRAND_DURATION_MS = 2000;
export const STARTUP_LOADING_DURATION_MS = 1000;

export function getStartupPhase({
  elapsedMs,
  bootstrapComplete,
  brandDurationMs = STARTUP_BRAND_DURATION_MS,
  loadingDurationMs = STARTUP_LOADING_DURATION_MS,
}: StartupTimingInput): Exclude<StartupPhase, 'nativeSplash'> {
  if (elapsedMs < brandDurationMs) {
    return 'brand';
  }

  if (elapsedMs < brandDurationMs + loadingDurationMs || !bootstrapComplete) {
    return 'loading';
  }

  return 'ready';
}

