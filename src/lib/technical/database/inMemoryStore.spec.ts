import { describe, expect, test } from 'vitest';
import { createInMemoryStore } from './inMemoryStore';

describe('createInMemoryStore', () => {
	test('returns null for a key that was never set', async () => {
		const store = createInMemoryStore();

		expect(await store.get('habits')).toBeNull();
	});

	test('round-trips a JSON-serializable value', async () => {
		const store = createInMemoryStore();

		await store.set('habits', [{ id: 'a', name: 'Méditation' }]);

		expect(await store.get('habits')).toEqual([{ id: 'a', name: 'Méditation' }]);
	});

	test('remove deletes the stored value', async () => {
		const store = createInMemoryStore();
		await store.set('habits', ['x']);

		await store.remove('habits');

		expect(await store.get('habits')).toBeNull();
	});

	test('keeps separate stores independent', async () => {
		const storeA = createInMemoryStore();
		const storeB = createInMemoryStore();

		await storeA.set('key', 'a');
		await storeB.set('key', 'b');

		expect(await storeA.get('key')).toBe('a');
		expect(await storeB.get('key')).toBe('b');
	});
});
