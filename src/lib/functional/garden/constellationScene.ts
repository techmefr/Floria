import { mulberry32 } from './prng';
import type { IGardenPlant } from './gardenPlant';
import type { Family } from './families';

export interface IConstellationNode {
	habitId: string;
	family: Family;
	seed: number;
	x: number;
	y: number;
	size: number;
	intensity: number;
	floatDurationSeconds: number;
	floatDelaySeconds: number;
}

export function computeConstellationScene(plants: IGardenPlant[]): IConstellationNode[] {
	return plants.map((plant, index) => {
		const rng = mulberry32(plant.seed + 1000);

		return {
			habitId: plant.habitId,
			family: plant.family,
			seed: plant.seed,
			x: 15 + rng() * 70,
			y: 12 + rng() * 76,
			size: 42 + rng() * 34,
			intensity: Math.max(plant.consistency, plant.recentEnergy * 0.85),
			floatDurationSeconds: 5 + (index % 4),
			floatDelaySeconds: index * 0.5
		};
	});
}
