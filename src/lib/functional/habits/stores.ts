import { get, writable, type Writable } from 'svelte/store';
import type { IKeyValueStore } from '$lib/technical/database';
import type { IHabit, ILog } from './types';

const HABITS_KEY = 'floria.habits';
const LOGS_KEY = 'floria.logs';

export interface IHabitsStore {
	habits: Writable<IHabit[]>;
	logs: Writable<ILog[]>;
	load(): Promise<void>;
	addHabit(habit: IHabit): Promise<void>;
	updateHabit(id: string, patch: Partial<IHabit>): Promise<void>;
	archiveHabit(id: string): Promise<void>;
	addLog(log: ILog): Promise<void>;
}

export function createHabitsStore(kv: IKeyValueStore): IHabitsStore {
	const habits = writable<IHabit[]>([]);
	const logs = writable<ILog[]>([]);

	async function load(): Promise<void> {
		habits.set((await kv.get<IHabit[]>(HABITS_KEY)) ?? []);
		logs.set((await kv.get<ILog[]>(LOGS_KEY)) ?? []);
	}

	async function persistHabits(next: IHabit[]): Promise<void> {
		habits.set(next);
		await kv.set(HABITS_KEY, next);
	}

	async function persistLogs(next: ILog[]): Promise<void> {
		logs.set(next);
		await kv.set(LOGS_KEY, next);
	}

	async function addHabit(habit: IHabit): Promise<void> {
		await persistHabits([...get(habits), habit]);
	}

	async function updateHabit(id: string, patch: Partial<IHabit>): Promise<void> {
		await persistHabits(
			get(habits).map((habit) => (habit.id === id ? { ...habit, ...patch } : habit))
		);
	}

	async function archiveHabit(id: string): Promise<void> {
		await updateHabit(id, { isArchived: true });
	}

	async function addLog(log: ILog): Promise<void> {
		await persistLogs([...get(logs), log]);
	}

	return { habits, logs, load, addHabit, updateHabit, archiveHabit, addLog };
}
