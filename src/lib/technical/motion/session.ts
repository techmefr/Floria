import { readable, type Readable } from 'svelte/store';

export function createTicker(startedAt: number, intervalMs = 250): Readable<number> {
	return readable(Date.now() - startedAt, (set) => {
		const id = setInterval(() => {
			set(Date.now() - startedAt);
		}, intervalMs);

		return () => clearInterval(id);
	});
}
