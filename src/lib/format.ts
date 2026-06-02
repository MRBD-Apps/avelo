/** Tiny pure helper — here to show the unit-testing setup. */
export function formatCount(n: number): string {
  if (n === 0) return '0 items';
  if (n === 1) return '1 item';
  return `${n} items`;
}
