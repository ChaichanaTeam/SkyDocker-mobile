import { getStartupPhase } from './startupTiming';

describe('startup timing', () => {
  it('shows the brand phase for the first two seconds', () => {
    expect(getStartupPhase({ elapsedMs: 0, bootstrapComplete: false })).toBe('brand');
    expect(getStartupPhase({ elapsedMs: 1999, bootstrapComplete: true })).toBe('brand');
  });

  it('shows loading until at least three seconds have passed', () => {
    expect(getStartupPhase({ elapsedMs: 2000, bootstrapComplete: true })).toBe('loading');
    expect(getStartupPhase({ elapsedMs: 2999, bootstrapComplete: true })).toBe('loading');
  });

  it('stays loading after the minimum timing while bootstrap is incomplete', () => {
    expect(getStartupPhase({ elapsedMs: 3500, bootstrapComplete: false })).toBe('loading');
  });

  it('becomes ready only after the brand, loader, and bootstrap are complete', () => {
    expect(getStartupPhase({ elapsedMs: 3000, bootstrapComplete: true })).toBe('ready');
  });
});

