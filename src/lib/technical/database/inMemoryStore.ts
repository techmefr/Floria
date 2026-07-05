import type { IKeyValueStore } from './types';

export function createInMemoryStore(): IKeyValueStore {
	const entries = new Map<string, string>();

	return {
		async get<T>(key: string): Promise<T | null> {
			const raw = entries.get(key);
			return raw === undefined ? null : (JSON.parse(raw) as T);
		},
		async set<T>(key: string, value: T): Promise<void> {
			entries.set(key, JSON.stringify(value));
		},
		async remove(key: string): Promise<void> {
			entries.delete(key);
		}
	};
}
