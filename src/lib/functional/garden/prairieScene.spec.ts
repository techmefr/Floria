import { describe, expect, test } from 'vitest';
import { computePrairieScene } from './prairieScene';
import type { IGardenPlant } from './gardenPlant';

function makePlant(overrides: Partial<IGardenPlant> = {}): IGardenPlant {
	return {
		habitId: 'medit',
		name: 'Méditation',
		cadence: 'Chaque matin',
		family: 'meditation',
		seed: 101,
		consistency: 0.7,
		recentEnergy: 0.6,
		isDoneToday: false,
		...overrides
	};
}

describe('computePrairieScene', () => {
	test('is deterministic for the same plant list', () => {
		const plants = [makePlant(), makePlant({ habitId: 'sport', seed: 303 })];

		expect(computePrairieScene(plants)).toEqual(computePrairieScene(plants));
	});

	test('a plant done today grows taller than the same plant not done today', () => {
		const [notDone] = computePrairieScene([makePlant({ isDoneToday: false })]);
		const [done] = computePrairieScene([makePlant({ isDoneToday: true })]);

		const scaleOf = (transform: string) => Number(transform.match(/scale\(([\d.]+)\)/)?.[1]);

		expect(scaleOf(done.flowerTransform)).toBeGreaterThan(scaleOf(notDone.flowerTransform));
	});

	test('intensity is the max of consistency and 0.85x recent energy', () => {
		const [lowRecent] = computePrairieScene([makePlant({ consistency: 0.8, recentEnergy: 0.1 })]);
		const [highRecent] = computePrairieScene([makePlant({ consistency: 0.2, recentEnergy: 1 })]);

		expect(lowRecent.intensity).toBeCloseTo(0.8);
		expect(highRecent.intensity).toBeCloseTo(0.85);
	});

	test('stems start at the ground line', () => {
		const [scene] = computePrairieScene([makePlant()]);

		expect(scene.stemPathD.startsWith('M ')).toBe(true);
		expect(scene.stemPathD).toContain('300');
	});
});
