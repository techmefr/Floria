import { describe, expect, test } from 'vitest';
import { get } from 'svelte/store';
import { createBloom } from './bloom';

describe('createBloom', () => {
	test('clamps the initial value into 0..1', () => {
		expect(get(createBloom(1.2))).toBe(1);
		expect(get(createBloom(-0.1))).toBe(0);
	});
});
