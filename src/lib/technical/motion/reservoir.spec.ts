import { describe, expect, test } from 'vitest';
import { get } from 'svelte/store';
import { createReservoir } from './reservoir';

describe('createReservoir', () => {
	test('clamps the initial fraction into 0..1', () => {
		expect(get(createReservoir(1.4))).toBe(1);
		expect(get(createReservoir(-0.3))).toBe(0);
	});

	test('updates immediately when reduce-motion is on', async () => {
		const level = createReservoir(0, true);

		await level.set(0.5);

		expect(get(level)).toBe(0.5);
	});
});
