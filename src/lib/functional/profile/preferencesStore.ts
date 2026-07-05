import { get, writable, type Writable } from 'svelte/store';
import type { IKeyValueStore } from '$lib/technical/database';
import { DEFAULT_PREFERENCES, type IPreferences } from './types';

const PREFERENCES_KEY = 'floria.preferences';

export interface IPreferencesStore {
	preferences: Writable<IPreferences>;
	load(): Promise<void>;
	update(patch: Partial<IPreferences>): Promise<void>;
}

export function createPreferencesStore(kv: IKeyValueStore): IPreferencesStore {
	const preferences = writable<IPreferences>(DEFAULT_PREFERENCES);

	async function load(): Promise<void> {
		const stored = await kv.get<IPreferences>(PREFERENCES_KEY);
		preferences.set(stored ? { ...DEFAULT_PREFERENCES, ...stored } : DEFAULT_PREFERENCES);
	}

	async function update(patch: Partial<IPreferences>): Promise<void> {
		const next = { ...get(preferences), ...patch };
		preferences.set(next);
		await kv.set(PREFERENCES_KEY, next);
	}

	return { preferences, load, update };
}
