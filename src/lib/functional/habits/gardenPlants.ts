import { stats, todayFraction } from './stats';
import type { IHabit, ILog } from './types';
import type { IGardenPlant } from '$lib/functional/garden';

export function cadenceLabel(habit: IHabit): string {
	if (habit.cadence === 'objectif' && habit.goal) {
		return `Objectif ${habit.goal.target} ${habit.goal.unit}`;
	}
	if (habit.cadence === 'quelques-fois') {
		return 'Quelques fois';
	}
	return 'Quotidien';
}

export function buildGardenPlants(
	habits: IHabit[],
	logs: ILog[],
	now: number = Date.now()
): IGardenPlant[] {
	return habits
		.filter((habit) => !habit.isArchived)
		.map((habit) => {
			const { cons, recent } = stats(habit, logs, now);
			return {
				habitId: habit.id,
				name: habit.name,
				cadence: cadenceLabel(habit),
				family: habit.family,
				seed: habit.seed,
				consistency: cons,
				recentEnergy: recent,
				isDoneToday: todayFraction(habit, logs, now) >= 1
			};
		});
}
