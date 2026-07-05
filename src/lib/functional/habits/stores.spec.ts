import { describe, expect, test } from 'vitest';
import { get } from 'svelte/store';
import { createInMemoryStore } from '$lib/technical/database';
import { createHabitsStore } from './stores';
import type { IHabit } from './types';

function makeHabit(overrides: Partial<IHabit> = {}): IHabit {
	return {
		id: 'medit',
		name: 'Méditation',
		family: 'meditation',
		cadence: 'quotidien',
		daily: { target: 10, step: 2, unit: 'min' },
		seed: 101,
		createdAt: 1_700_000_000_000,
		...overrides
	};
}

describe('createHabitsStore', () => {
	test('starts empty until load() reads from persistence', async () => {
		const kv = createInMemoryStore();
		await kv.set('floria.habits', [makeHabit()]);

		const store = createHabitsStore(kv);
		expect(get(store.habits)).toEqual([]);

		await store.load();
		expect(get(store.habits)).toEqual([makeHabit()]);
	});

	test('addHabit appends and persists', async () => {
		const kv = createInMemoryStore();
		const store = createHabitsStore(kv);

		await store.addHabit(makeHabit());

		expect(get(store.habits)).toEqual([makeHabit()]);
		expect(await kv.get('floria.habits')).toEqual([makeHabit()]);
	});

	test('updateHabit patches only the matching habit', async () => {
		const kv = createInMemoryStore();
		const store = createHabitsStore(kv);
		await store.addHabit(makeHabit({ id: 'a' }));
		await store.addHabit(makeHabit({ id: 'b', name: 'Sport' }));

		await store.updateHabit('a', { name: 'Méditation du soir' });

		const habits = get(store.habits);
		expect(habits.find((h) => h.id === 'a')?.name).toBe('Méditation du soir');
		expect(habits.find((h) => h.id === 'b')?.name).toBe('Sport');
	});

	test('archiveHabit sets isArchived without deleting the habit', async () => {
		const kv = createInMemoryStore();
		const store = createHabitsStore(kv);
		await store.addHabit(makeHabit());

		await store.archiveHabit('medit');

		const habits = get(store.habits);
		expect(habits).toHaveLength(1);
		expect(habits[0].isArchived).toBe(true);
	});

	test('addLog appends and persists a log', async () => {
		const kv = createInMemoryStore();
		const store = createHabitsStore(kv);

		await store.addLog({ id: 'log-1', habitId: 'medit', ts: 1000, amount: 10 });

		expect(get(store.logs)).toEqual([{ id: 'log-1', habitId: 'medit', ts: 1000, amount: 10 }]);
		expect(await kv.get('floria.logs')).toEqual([
			{ id: 'log-1', habitId: 'medit', ts: 1000, amount: 10 }
		]);
	});
});
