import { describe, it, expect } from 'vitest';
import { formatCount } from './format';

describe('formatCount', () => {
  it('pluralizes correctly', () => {
    expect(formatCount(0)).toBe('0 items');
    expect(formatCount(1)).toBe('1 item');
    expect(formatCount(5)).toBe('5 items');
  });
});
