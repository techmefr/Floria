import { describe, expect, test } from 'vitest';
import { stats, todayAmount, todayFraction, paliers, formatPalierLabel } from './stats';
import type { IHabit, ILog } from './types';

const NOW = new Date('2026-07-05T18:00:00').getTime();
const DAY_MS = 86_400_000;

function makeHabit(overrides: Partial<IHabit> = {}): IHabit {
	return {
		id: 'medit',
		name: 'Méditation',
		family: 'meditation',
		cadence: 'quotidien',
		daily: { target: 10, step: 2, unit: 'min' },
		seed: 101,
		createdAt: NOW - 90 * DAY_MS,
		...overrides
	};
}

function logAt(habitId: string, daysAgo: number, amount: number): ILog {
	return { id: `${habitId}-${daysAgo}`, habitId, ts: NOW - daysAgo * DAY_MS, amount };
}

describe('stats', () => {
	test('cons is the fraction of the last 28 days with any logged amount', () => {
		const habit = makeHabit();
		const logs = [logAt('medit', 0, 10), logAt('medit', 1, 5), logAt('medit', 10, 2)];

		expect(stats(habit, logs, NOW).cons).toBeCloseTo(3 / 28);
	});

	test('recent is the fraction of the last 7 days with any logged amount', () => {
		const habit = makeHabit();
		const logs = [logAt('medit', 0, 10), logAt('medit', 6, 5), logAt('medit', 20, 2)];

		expect(stats(habit, logs, NOW).recent).toBeCloseTo(2 / 7);
	});

	test('a log for a different habit does not count', () => {
		const habit = makeHabit();
		const logs = [logAt('sport', 0, 10)];

		expect(stats(habit, logs, NOW).cons).toBe(0);
	});

	test('prog is 0 for a habit with no goal', () => {
		expect(stats(makeHabit(), [], NOW).prog).toBe(0);
	});

	test('prog is the clamped fraction between goal.start and goal.target', () => {
		const habit = makeHabit({
			cadence: 'objectif',
			goal: { start: 1, current: 4, target: 10, unit: 'km' }
		});

		expect(stats(habit, [], NOW).prog).toBeCloseTo(3 / 9);
	});

	test('prog never exceeds 1 even if current is past target', () => {
		const habit = makeHabit({
			cadence: 'objectif',
			goal: { start: 1, current: 99, target: 10, unit: 'km' }
		});

		expect(stats(habit, [], NOW).prog).toBe(1);
	});
});

describe('todayAmount / todayFraction', () => {
	test('sums only today logs for the given habit', () => {
		const habit = makeHabit();
		const logs = [logAt('medit', 0, 3), logAt('medit', 0, 2), logAt('medit', 1, 100)];

		expect(todayAmount(habit, logs, NOW)).toBe(5);
	});

	test('fraction is clamped at 1 even past the target', () => {
		const habit = makeHabit({ daily: { target: 10, step: 2, unit: 'min' } });
		const logs = [logAt('medit', 0, 40)];

		expect(todayFraction(habit, logs, NOW)).toBe(1);
	});

	test('fraction reflects partial progress', () => {
		const habit = makeHabit({ daily: { target: 10, step: 2, unit: 'min' } });
		const logs = [logAt('medit', 0, 5)];

		expect(todayFraction(habit, logs, NOW)).toBe(0.5);
	});
});

describe('paliers', () => {
	test('marks a palier reached once today amount meets its threshold', () => {
		const habit = makeHabit({ daily: { target: 2, step: 0.25, unit: 'L' } });
		const logs = [logAt('medit', 0, 1)];

		const result = paliers(habit, logs, NOW);

		expect(result.map((p) => p.isReached)).toEqual([true, true, false, false]);
	});

	test('formats decimal-unit thresholds with the habit unit', () => {
		const habit = makeHabit({ daily: { target: 2, step: 0.25, unit: 'L' } });

		expect(paliers(habit, [], NOW).map((p) => p.label)).toEqual(['0,5 L', '1 L', '1,5 L', '2 L']);
	});

	test('formats minute-unit thresholds as mm:ss', () => {
		const habit = makeHabit({ daily: { target: 10, step: 2, unit: 'min' } });

		expect(paliers(habit, [], NOW).map((p) => p.label)).toEqual(['2:30', '5:00', '7:30', '10:00']);
	});

	test('formats second-unit thresholds as mm:ss', () => {
		const habit = makeHabit({ daily: { target: 120, step: 15, unit: 's' } });

		expect(paliers(habit, [], NOW).map((p) => p.label)).toEqual(['0:30', '1:00', '1:30', '2:00']);
	});
});

describe('formatPalierLabel', () => {
	test('formats km with a comma decimal', () => {
		expect(formatPalierLabel(1.25, 'km')).toBe('1,25 km');
	});
});
