import type { Family } from './families';

export interface IGardenPlant {
	habitId: string;
	name: string;
	cadence: string;
	family: Family;
	seed: number;
	consistency: number;
	recentEnergy: number;
	isDoneToday: boolean;
}
