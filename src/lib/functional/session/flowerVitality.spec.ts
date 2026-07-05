import { describe, expect, test } from 'vitest';
import { flowerIntensity, plantSize } from './flowerVitality';

describe('flowerIntensity', () => {
	test('matches the MECHANICS.md formula: max(0.2, cons * (0.35 + 0.65 * vit))', () => {
		expect(flowerIntensity(0.8, 3)).toBeCloseTo(0.8 * (0.35 + 0.65 * 1));
		expect(flowerIntensity(0.8, 0)).toBeCloseTo(0.8 * 0.35);
	});

	test('never drops below the 0.2 floor', () => {
		expect(flowerIntensity(0, 0)).toBe(0.2);
	});
});

describe('plantSize', () => {
	test('matches the MECHANICS.md formula: base * (0.6 + 0.52 * cons) * (0.7 + 0.3 * vit)', () => {
		const base = 100;
		expect(plantSize(base, 0.7, 3)).toBeCloseTo(base * (0.6 + 0.52 * 0.7) * (0.7 + 0.3 * 1));
	});

	test('is smallest at zero consistency and zero suns', () => {
		expect(plantSize(100, 0, 0)).toBeCloseTo(100 * 0.6 * 0.7);
	});
});
