import { describe, expect, test } from 'vitest';
import { sessionReducer, sessionFraction } from './sessionMachine';

const START_NOW = 1_000_000;

describe('sessionReducer', () => {
	test('start creates a fresh running session at elapsed 0', () => {
		const state = sessionReducer(null, {
			type: 'start',
			habitId: 'medit',
			duration: 600,
			now: START_NOW
		});

		expect(state).toEqual({
			habitId: 'medit',
			startedAt: START_NOW,
			elapsed: 0,
			duration: 600,
			running: true,
			done: false
		});
	});

	test('tick advances elapsed from wall-clock time while running', () => {
		const started = sessionReducer(null, {
			type: 'start',
			habitId: 'medit',
			duration: 600,
			now: START_NOW
		});

		const ticked = sessionReducer(started, { type: 'tick', now: START_NOW + 200_000 });

		expect(ticked?.elapsed).toBe(200);
		expect(ticked?.running).toBe(true);
		expect(ticked?.done).toBe(false);
	});

	test('tick past the duration marks the session done and stops it', () => {
		const started = sessionReducer(null, {
			type: 'start',
			habitId: 'medit',
			duration: 600,
			now: START_NOW
		});

		const finished = sessionReducer(started, { type: 'tick', now: START_NOW + 900_000 });

		expect(finished?.elapsed).toBe(600);
		expect(finished?.done).toBe(true);
		expect(finished?.running).toBe(false);
	});

	test('tick on a null or non-running session is a no-op', () => {
		expect(sessionReducer(null, { type: 'tick', now: START_NOW })).toBeNull();

		const paused = sessionReducer(
			sessionReducer(null, { type: 'start', habitId: 'medit', duration: 600, now: START_NOW }),
			{ type: 'pause' }
		);
		expect(sessionReducer(paused, { type: 'tick', now: START_NOW + 500_000 })).toEqual(paused);
	});

	test('pause freezes elapsed and resume continues from where it left off', () => {
		let state = sessionReducer(null, {
			type: 'start',
			habitId: 'medit',
			duration: 600,
			now: START_NOW
		});
		state = sessionReducer(state, { type: 'tick', now: START_NOW + 100_000 });
		state = sessionReducer(state, { type: 'pause' });

		expect(state?.running).toBe(false);
		expect(state?.elapsed).toBe(100);

		state = sessionReducer(state, { type: 'resume', now: START_NOW + 300_000 });
		expect(state?.running).toBe(true);

		state = sessionReducer(state, { type: 'tick', now: START_NOW + 350_000 });
		expect(state?.elapsed).toBe(150);
	});

	test('stop clears the session regardless of its current phase', () => {
		const running = sessionReducer(null, {
			type: 'start',
			habitId: 'medit',
			duration: 600,
			now: START_NOW
		});

		expect(sessionReducer(running, { type: 'stop' })).toBeNull();
	});

	test('close clears a done session', () => {
		const done = sessionReducer(null, { type: 'start', habitId: 'medit', duration: 1, now: 0 });
		const finished = sessionReducer(done, { type: 'tick', now: 2000 });

		expect(finished?.done).toBe(true);
		expect(sessionReducer(finished, { type: 'close' })).toBeNull();
	});
});

describe('sessionFraction', () => {
	test('is elapsed over duration, clamped to 1', () => {
		expect(
			sessionFraction({
				habitId: 'medit',
				startedAt: 0,
				elapsed: 300,
				duration: 600,
				running: true,
				done: false
			})
		).toBe(0.5);

		expect(
			sessionFraction({
				habitId: 'medit',
				startedAt: 0,
				elapsed: 700,
				duration: 600,
				running: false,
				done: true
			})
		).toBe(1);
	});
});
