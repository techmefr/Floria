import { describe, expect, test } from 'vitest';
import { createHabitTools } from './habitTools';
import type { IHabit } from '$lib/functional/habits';

const HABITS: IHabit[] = [
	{
		id: 'medit',
		name: 'Méditation',
		family: 'meditation',
		cadence: 'quotidien',
		daily: { target: 10, step: 2, unit: 'min' },
		seed: 101,
		createdAt: 0
	},
	{
		id: 'old',
		name: 'Ancienne habitude',
		family: 'poppy',
		cadence: 'quotidien',
		daily: { target: 1, step: 1, unit: 'fois' },
		seed: 5,
		createdAt: 0,
		isArchived: true
	}
];

function makeDeps() {
	return {
		listHabits: () => HABITS,
		getHabit: (id: string) => HABITS.find((h) => h.id === id),
		buildSuggestion: (partial: Partial<IHabit>) =>
			({ ...partial, id: partial.id ?? 'new-id' }) as IHabit
	};
}

describe('createHabitTools', () => {
	test('lister_habitudes excludes archived habits and returns a light summary', async () => {
		const tools = createHabitTools(makeDeps());

		const result = await tools.lister_habitudes({});

		expect(result).toEqual([{ id: 'medit', name: 'Méditation', cadence: 'quotidien' }]);
	});

	test('proposer_habitude builds a suggestion from the given partial', async () => {
		const tools = createHabitTools(makeDeps());

		const result = await tools.proposer_habitude({ name: 'Étirements' });

		expect(result).toMatchObject({ name: 'Étirements' });
	});

	test('adapter_habitude merges the patch onto the existing habit', async () => {
		const tools = createHabitTools(makeDeps());

		const result = await tools.adapter_habitude({
			id: 'medit',
			patch: { cadence: 'quelques-fois' }
		});

		expect(result).toMatchObject({ id: 'medit', name: 'Méditation', cadence: 'quelques-fois' });
	});

	test('adapter_habitude throws for an unknown id', () => {
		const tools = createHabitTools(makeDeps());

		expect(() => tools.adapter_habitude({ id: 'ghost', patch: {} })).toThrow(
			'Habit "ghost" not found'
		);
	});
});
