import { describe, expect, test } from 'vitest';
import { plantLayout, SCENE_WIDTH } from './layout';

describe('plantLayout', () => {
	test('is deterministic for the same seed/index/total', () => {
		expect(plantLayout(101, 2, 5)).toEqual(plantLayout(101, 2, 5));
	});

	test('centers the single plant when there is only one habit', () => {
		expect(plantLayout(101, 0, 1).px).toBe(SCENE_WIDTH / 2);
	});

	test('spreads plants from the first to the last position across the scene width', () => {
		const first = plantLayout(101, 0, 3);
		const last = plantLayout(101, 2, 3);

		expect(first.px).toBeLessThan(last.px);
	});

	test('keeps baseHeight and baseScale within their designed ranges', () => {
		for (let seed = 0; seed < 20; seed += 1) {
			const layout = plantLayout(seed, 0, 4);
			expect(layout.baseHeight).toBeGreaterThanOrEqual(90);
			expect(layout.baseHeight).toBeLessThanOrEqual(200);
			expect(layout.baseScale).toBeGreaterThanOrEqual(0.5);
			expect(layout.baseScale).toBeLessThanOrEqual(0.95);
		}
	});
});
