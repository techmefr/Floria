import { describe, expect, test } from 'vitest';
import { computeConstellationScene } from './constellationScene';
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

describe('computeConstellationScene', () => {
	test('is deterministic for the same plant list', () => {
		const plants = [makePlant(), makePlant({ habitId: 'sport', seed: 303 })];

		expect(computeConstellationScene(plants)).toEqual(computeConstellationScene(plants));
	});

	test('keeps node positions and sizes within the designed bounds', () => {
		for (let seed = 0; seed < 20; seed += 1) {
			const [node] = computeConstellationScene([makePlant({ seed })]);
			expect(node.x).toBeGreaterThanOrEqual(15);
			expect(node.x).toBeLessThanOrEqual(85);
			expect(node.y).toBeGreaterThanOrEqual(12);
			expect(node.y).toBeLessThanOrEqual(88);
			expect(node.size).toBeGreaterThanOrEqual(42);
			expect(node.size).toBeLessThanOrEqual(76);
		}
	});
});
