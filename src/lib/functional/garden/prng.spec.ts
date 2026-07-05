import { describe, expect, test } from 'vitest';
import { mulberry32 } from './prng';

describe('mulberry32', () => {
	test('is deterministic for a given seed', () => {
		const first = Array.from({ length: 5 }, mulberry32(42));
		const second = Array.from({ length: 5 }, mulberry32(42));

		expect(first).toEqual(second);
	});

	test('produces different sequences for different seeds', () => {
		const a = mulberry32(1);
		const b = mulberry32(2);

		expect(a()).not.toBe(b());
	});

	test('always returns a value in [0, 1)', () => {
		const rng = mulberry32(7);

		for (let i = 0; i < 100; i += 1) {
			const value = rng();
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});

	test('treats a seed of 0 the same as a seed of 1', () => {
		const withZero = mulberry32(0)();
		const withOne = mulberry32(1)();

		expect(withZero).toBe(withOne);
	});
});
