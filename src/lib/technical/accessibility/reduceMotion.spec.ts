import { describe, expect, test } from 'vitest';
import { effectiveReduceMotion } from './reduceMotion';

describe('effectiveReduceMotion', () => {
	test('is false when neither the user nor the system asks for it', () => {
		expect(effectiveReduceMotion(false, false)).toBe(false);
	});

	test('is true when the user override is on', () => {
		expect(effectiveReduceMotion(true, false)).toBe(true);
	});

	test('is true when the system preference is on', () => {
		expect(effectiveReduceMotion(false, true)).toBe(true);
	});
});
