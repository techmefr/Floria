import { plantLayout, GROUND_Y } from './layout';
import { stem, type IStemModel } from './stem';
import type { IGardenPlant } from './gardenPlant';
import type { Family } from './families';

export interface IPrairiePlantScene {
	habitId: string;
	name: string;
	stemPathD: string;
	leaf: IStemModel['leaf'];
	flowerTransform: string;
	family: Family;
	seed: number;
	intensity: number;
	swayDurationSeconds: number;
	swayDelaySeconds: number;
}

export function computePrairieScene(plants: IGardenPlant[]): IPrairiePlantScene[] {
	return plants.map((plant, index) => {
		const layout = plantLayout(plant.seed, index, plants.length);
		const grown = plant.isDoneToday ? 1.07 : 1;
		const scale = layout.baseScale * (0.6 + 0.52 * plant.consistency) * grown;
		const height = layout.baseHeight * (0.5 + 0.65 * plant.consistency);
		const tx = layout.px + layout.dx;
		const ty = GROUND_Y - height;
		const stemModel = stem(layout.px, GROUND_Y, tx, ty);

		return {
			habitId: plant.habitId,
			name: plant.name,
			stemPathD: stemModel.pathD,
			leaf: stemModel.leaf,
			flowerTransform: `translate(${tx - 50 * scale} ${ty - 50 * scale}) scale(${scale})`,
			family: plant.family,
			seed: plant.seed,
			intensity: Math.max(plant.consistency, plant.recentEnergy * 0.85),
			swayDurationSeconds: 4 + (index % 3),
			swayDelaySeconds: index * 0.4
		};
	});
}
