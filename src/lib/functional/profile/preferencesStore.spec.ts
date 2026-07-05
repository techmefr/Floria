import { describe, expect, test } from 'vitest';
import { get } from 'svelte/store';
import { createInMemoryStore } from '$lib/technical/database';
import { createPreferencesStore } from './preferencesStore';
import { DEFAULT_PREFERENCES } from './types';

describe('createPreferencesStore', () => {
	test('starts with the defaults before load()', () => {
		const store = createPreferencesStore(createInMemoryStore());
		expect(get(store.preferences)).toEqual(DEFAULT_PREFERENCES);
	});

	test('load() merges persisted values over the defaults', async () => {
		const kv = createInMemoryStore();
		await kv.set('floria.preferences', { fontScale: 1.3 });

		const store = createPreferencesStore(kv);
		await store.load();

		expect(get(store.preferences)).toEqual({ ...DEFAULT_PREFERENCES, fontScale: 1.3 });
	});

	test('update patches and persists only the given fields', async () => {
		const kv = createInMemoryStore();
		const store = createPreferencesStore(kv);

		await store.update({ highContrast: true });
		await store.update({ gardenLayout: 'constellation' });

		expect(get(store.preferences)).toEqual({
			...DEFAULT_PREFERENCES,
			highContrast: true,
			gardenLayout: 'constellation'
		});
		expect(await kv.get('floria.preferences')).toEqual({
			...DEFAULT_PREFERENCES,
			highContrast: true,
			gardenLayout: 'constellation'
		});
	});

	test('resetAll restores the defaults, in memory and in persistence', async () => {
		const kv = createInMemoryStore();
		const store = createPreferencesStore(kv);
		await store.update({ highContrast: true, fontScale: 1.3 });

		await store.resetAll();

		expect(get(store.preferences)).toEqual(DEFAULT_PREFERENCES);
		expect(await kv.get('floria.preferences')).toEqual(DEFAULT_PREFERENCES);
	});
});
