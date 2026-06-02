import { describe, it, expect } from 'vitest';
import { stationLevel, fillPercent } from './status';

const base = { status: 'IN_SERVICE', isRenting: true, bikes: 10 };

describe('stationLevel', () => {
  it('offline when not in service or not renting', () => {
    expect(stationLevel({ ...base, status: 'MAINTENANCE' })).toBe('offline');
    expect(stationLevel({ ...base, isRenting: false })).toBe('offline');
  });

  it('empty when no bikes', () => {
    expect(stationLevel({ ...base, bikes: 0 })).toBe('empty');
  });

  it('low under 5 bikes', () => {
    expect(stationLevel({ ...base, bikes: 3 })).toBe('low');
  });

  it('ok with enough bikes', () => {
    expect(stationLevel({ ...base, bikes: 10 })).toBe('ok');
  });
});

describe('fillPercent', () => {
  it('computes bikes / capacity as a percent', () => {
    expect(fillPercent({ bikes: 150, capacity: 200 })).toBe(75);
    expect(fillPercent({ bikes: 0, capacity: 20 })).toBe(0);
  });
  it('returns 0 when capacity is missing', () => {
    expect(fillPercent({ bikes: 5, capacity: 0 })).toBe(0);
  });
});
