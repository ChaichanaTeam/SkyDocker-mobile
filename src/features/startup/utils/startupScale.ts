export const STARTUP_BASELINE_WIDTH = 412;

export type StartupMetrics = {
  logoFontSize: number;
  logoLineHeight: number;
  spinnerSize: number;
  spinnerStrokeWidth: number;
};

export function scaleStartupMetric(value: number, viewportWidth: number): number {
  return value * Math.min(viewportWidth / STARTUP_BASELINE_WIDTH, 1);
}

export function getStartupMetrics(viewportWidth: number): StartupMetrics {
  return {
    logoFontSize: scaleStartupMetric(64, viewportWidth),
    logoLineHeight: scaleStartupMetric(77, viewportWidth),
    spinnerSize: scaleStartupMetric(112, viewportWidth),
    spinnerStrokeWidth: scaleStartupMetric(5, viewportWidth),
  };
}

