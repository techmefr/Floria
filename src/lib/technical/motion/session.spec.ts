import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createTicker } from './session';

describe('createTicker', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('emits elapsed time computed from wall-clock since startedAt', () => {
		const startedAt = Date.now();
		const ticker = createTicker(startedAt, 250);

		const values: number[] = [];
		const unsubscribe = ticker.subscribe((value) => values.push(value));

		vi.advanceTimersByTime(500);

		unsubscribe();

		expect(values).toEqual([0, 250, 500]);
	});

	test('stops emitting after the subscriber unsubscribes', () => {
		const ticker = createTicker(Date.now(), 250);

		const values: number[] = [];
		const unsubscribe = ticker.subscribe((value) => values.push(value));
		unsubscribe();
		const countAfterUnsubscribe = values.length;

		vi.advanceTimersByTime(1000);

		expect(values.length).toBe(countAfterUnsubscribe);
	});
});
