import { describe, it, expect } from 'vitest';
import { distanceMeters, formatDistance } from './distance';

describe('distanceMeters', () => {
  it('is 0 for identical points', () => {
    const p = { lat: 46.78, lon: -71.27 };
    expect(distanceMeters(p, p)).toBeCloseTo(0, 3);
  });

  it('computes ~1.11 km for 0.01° of latitude', () => {
    const d = distanceMeters({ lat: 46.78, lon: -71.27 }, { lat: 46.79, lon: -71.27 });
    expect(d).toBeGreaterThan(1100);
    expect(d).toBeLessThan(1120);
  });
});

describe('formatDistance', () => {
  it('formats metres and kilometres', () => {
    expect(formatDistance(120)).toBe('120 m');
    expect(formatDistance(1400)).toBe('1.4 km');
    expect(formatDistance(15000)).toBe('15 km');
  });
});
