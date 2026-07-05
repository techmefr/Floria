import { describe, expect, test } from 'vitest';
import { buildGardenPlants, cadenceLabel } from './gardenPlants';
import type { IHabit, ILog } from './types';

const NOW = new Date('2026-07-05T18:00:00').getTime();

function makeHabit(overrides: Partial<IHabit> = {}): IHabit {
	return {
		id: 'medit',
		name: 'Méditation',
		family: 'meditation',
		cadence: 'quotidien',
		daily: { target: 10, step: 2, unit: 'min' },
		seed: 101,
		createdAt: NOW,
		...overrides
	};
}

describe('cadenceLabel', () => {
	test('labels an objectif habit with its goal target and unit', () => {
		const habit = makeHabit({
			cadence: 'objectif',
			goal: { start: 1, current: 4, target: 10, unit: 'km' }
		});

		expect(cadenceLabel(habit)).toBe('Objectif 10 km');
	});

	test('labels quelques-fois and quotidien habits generically', () => {
		expect(cadenceLabel(makeHabit({ cadence: 'quelques-fois' }))).toBe('Quelques fois');
		expect(cadenceLabel(makeHabit({ cadence: 'quotidien' }))).toBe('Quotidien');
	});
});

describe('buildGardenPlants', () => {
	test('excludes archived habits', () => {
		const plants = buildGardenPlants(
			[makeHabit({ id: 'a' }), makeHabit({ id: 'b', isArchived: true })],
			[],
			NOW
		);

		expect(plants.map((p) => p.habitId)).toEqual(['a']);
	});

	test('marks isDoneToday once the daily target is met', () => {
		const habit = makeHabit();
		const logs: ILog[] = [{ id: 'l1', habitId: 'medit', ts: NOW, amount: 10 }];

		const [plant] = buildGardenPlants([habit], logs, NOW);

		expect(plant.isDoneToday).toBe(true);
	});

	test('is not done today when logs fall short of the target', () => {
		const habit = makeHabit();
		const logs: ILog[] = [{ id: 'l1', habitId: 'medit', ts: NOW, amount: 3 }];

		const [plant] = buildGardenPlants([habit], logs, NOW);

		expect(plant.isDoneToday).toBe(false);
	});

	test('is deterministic for the same habits and logs', () => {
		const habits = [makeHabit()];
		expect(buildGardenPlants(habits, [], NOW)).toEqual(buildGardenPlants(habits, [], NOW));
	});
});
