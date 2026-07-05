import { describe, expect, test } from 'vitest';
import { get } from 'svelte/store';
import { createInMemoryStore } from '$lib/technical/database';
import { createSessionStore } from './sessionStore';

const NOW = 1_000_000;

describe('createSessionStore', () => {
	test('start begins a running session', async () => {
		const store = createSessionStore(createInMemoryStore());

		await store.start('medit', 600, NOW);

		expect(get(store.session)).toMatchObject({ habitId: 'medit', duration: 600, running: true });
	});

	test('tick advances elapsed without needing to await', async () => {
		const store = createSessionStore(createInMemoryStore());
		await store.start('medit', 600, NOW);

		store.tick(NOW + 200_000);

		expect(get(store.session)?.elapsed).toBe(200);
	});

	test('complete grants a sun, adds to the collection, and clears the session', async () => {
		const kv = createInMemoryStore();
		const store = createSessionStore(kv);
		await store.start('medit', 600, NOW);
		store.tick(NOW + 600_000);

		await store.complete();

		expect(get(store.session)).toBeNull();
		expect(get(store.suns).medit).toBe(3);
		expect(get(store.collected)).toBe(1);
		expect(await kv.get('floria.collected')).toBe(1);
	});

	test('complete caps suns at 3 even if already full', async () => {
		const store = createSessionStore(createInMemoryStore());
		await store.start('medit', 600, NOW);
		store.tick(NOW + 600_000);
		await store.complete();

		await store.start('medit', 600, NOW);
		store.tick(NOW + 600_000);
		await store.complete();

		expect(get(store.suns).medit).toBe(3);
	});

	test('abandon loses a sun and clears the session without adding to the collection', async () => {
		const store = createSessionStore(createInMemoryStore());
		await store.start('medit', 600, NOW);
		store.tick(NOW + 100_000);

		await store.abandon();

		expect(get(store.session)).toBeNull();
		expect(get(store.suns).medit).toBe(2);
		expect(get(store.collected)).toBe(0);
	});

	test('pause then resume preserves elapsed time across the round trip', async () => {
		const store = createSessionStore(createInMemoryStore());
		await store.start('medit', 600, NOW);
		store.tick(NOW + 100_000);
		await store.pause();

		expect(get(store.session)?.running).toBe(false);

		await store.resume(NOW + 300_000);
		store.tick(NOW + 350_000);

		expect(get(store.session)?.elapsed).toBe(150);
	});

	test('applyInactivityPenalty loses a sun once, and never twice on the same day', async () => {
		const store = createSessionStore(createInMemoryStore());

		await store.applyInactivityPenalty('sport', true, NOW);
		expect(get(store.suns).sport).toBe(2);

		await store.applyInactivityPenalty('sport', true, NOW + 1000);
		expect(get(store.suns).sport).toBe(2);
	});

	test('applyInactivityPenalty does nothing when the habit was active', async () => {
		const store = createSessionStore(createInMemoryStore());

		await store.applyInactivityPenalty('sport', false, NOW);

		expect(get(store.suns).sport).toBeUndefined();
	});

	test('load restores persisted suns, collected count and in-flight session', async () => {
		const kv = createInMemoryStore();
		const seedStore = createSessionStore(kv);
		await seedStore.start('medit', 600, NOW);
		await seedStore.complete();
		await seedStore.start('sport', 300, NOW);

		const freshStore = createSessionStore(kv);
		await freshStore.load();

		expect(get(freshStore.suns).medit).toBe(3);
		expect(get(freshStore.collected)).toBe(1);
		expect(get(freshStore.session)).toMatchObject({ habitId: 'sport', duration: 300 });
	});

	test('resetAll clears suns, collected count and any in-flight session', async () => {
		const kv = createInMemoryStore();
		const store = createSessionStore(kv);
		await store.start('medit', 600, NOW);
		await store.complete();
		await store.start('sport', 300, NOW);

		await store.resetAll();

		expect(get(store.suns)).toEqual({});
		expect(get(store.collected)).toBe(0);
		expect(get(store.session)).toBeNull();
		expect(await kv.get('floria.suns')).toEqual({});
		expect(await kv.get('floria.collected')).toBe(0);
	});
});
