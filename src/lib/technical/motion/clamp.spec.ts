import { describe, expect, test } from 'vitest';
import { clamp01 } from './clamp';

describe('clamp01', () => {
	test('leaves in-range values untouched', () => {
		expect(clamp01(0.42)).toBe(0.42);
	});

	test('clamps values above 1', () => {
		expect(clamp01(1.5)).toBe(1);
	});

	test('clamps values below 0', () => {
		expect(clamp01(-0.2)).toBe(0);
	});
});
