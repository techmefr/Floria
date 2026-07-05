import { describe, expect, test } from 'vitest';
import { makeFlower } from './engine';

describe('makeFlower', () => {
	test('is deterministic: same inputs always produce the same model', () => {
		const a = makeFlower('meditation', 101, 1, 'aquarelle', 0.72);
		const b = makeFlower('meditation', 101, 1, 'aquarelle', 0.72);

		expect(a).toEqual(b);
	});

	test('a different seed changes the petal angles', () => {
		const a = makeFlower('meditation', 101, 1, 'aquarelle', 0.72);
		const b = makeFlower('meditation', 202, 1, 'aquarelle', 0.72);

		expect(a.petals).not.toEqual(b.petals);
	});

	test('clamps intensity into [0.26, 1] and defaults to 1 when null', () => {
		const tooLow = makeFlower('water', 5, 1, 'aquarelle', 0);
		const tooHigh = makeFlower('water', 5, 1, 'aquarelle', 3);
		const clampedLow = makeFlower('water', 5, 1, 'aquarelle', 0.26);
		const missing = makeFlower('water', 5, 1, 'aquarelle', null);
		const full = makeFlower('water', 5, 1, 'aquarelle', 1);

		expect(tooLow).toEqual(clampedLow);
		expect(tooHigh).toEqual(full);
		expect(missing).toEqual(full);
	});

	test('maps each style to its watercolor filter', () => {
		expect(makeFlower('water', 1, 1, 'aquarelle').filterId).toBe('wc');
		expect(makeFlower('water', 1, 1, 'encre').filterId).toBe('wc-ink');
		expect(makeFlower('water', 1, 1, 'pastel').filterId).toBe('wc-soft');
	});

	test('only dark families (poppy) get a dark center disc', () => {
		expect(makeFlower('poppy', 1, 1, 'aquarelle').darkCenter).not.toBeNull();
		expect(makeFlower('water', 1, 1, 'aquarelle').darkCenter).toBeNull();
	});

	test('petal count grows with intensity, with a floor of 3', () => {
		const low = makeFlower('ranunculus', 1, 1, 'aquarelle', 0.26);
		const high = makeFlower('ranunculus', 1, 1, 'aquarelle', 1);

		expect(low.petals.length).toBeGreaterThanOrEqual(3);
		expect(high.petals.length).toBeGreaterThan(low.petals.length);
	});

	test('carries the bloom value through unchanged', () => {
		expect(makeFlower('cosmos', 1, 0.42, 'aquarelle').bloom).toBe(0.42);
	});
});
