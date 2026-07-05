import { describe, expect, test } from 'vitest';
import { toggleAmount } from './toggle';

describe('toggleAmount', () => {
	test('returns the amount needed to reach the target when not yet done', () => {
		expect(toggleAmount(3, 10)).toBe(7);
	});

	test('returns a negative amount that cancels today out once the target is met', () => {
		expect(toggleAmount(10, 10)).toBe(-10);
		expect(toggleAmount(15, 10)).toBe(-15);
	});
});
