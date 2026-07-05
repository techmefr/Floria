import { describe, expect, test } from 'vitest';
import { hashSeed, familyForCategory, defaultDaily, buildHabit } from './builder';

describe('hashSeed', () => {
	test('is deterministic for the same input', () => {
		expect(hashSeed('Méditation')).toBe(hashSeed('Méditation'));
	});

	test('differs for different inputs', () => {
		expect(hashSeed('Méditation')).not.toBe(hashSeed('Sport'));
	});

	test('is always a positive integer', () => {
		expect(hashSeed('')).toBeGreaterThan(0);
		expect(Number.isInteger(hashSeed('anything'))).toBe(true);
	});
});

describe('familyForCategory', () => {
	test('matches habit names to their expected family by keyword', () => {
		expect(familyForCategory('Méditation du matin')).toBe('meditation');
		expect(familyForCategory('Boire de l’eau')).toBe('water');
		expect(familyForCategory('Séance de sport')).toBe('poppy');
		expect(familyForCategory('Course à pied')).toBe('cosmos');
		expect(familyForCategory('Planche quotidienne')).toBe('ranunculus');
	});

	test('is case-insensitive', () => {
		expect(familyForCategory('MÉDITATION')).toBe('meditation');
	});

	test('falls back to a deterministic family for an unrecognized name', () => {
		expect(familyForCategory('Lecture du soir')).toBe(familyForCategory('Lecture du soir'));
	});
});

describe('buildHabit', () => {
	test('fills in every field with sensible defaults from a bare partial', () => {
		const habit = buildHabit({ name: 'Méditation du matin' });

		expect(habit.name).toBe('Méditation du matin');
		expect(habit.family).toBe('meditation');
		expect(habit.cadence).toBe('quotidien');
		expect(habit.daily).toEqual({ target: 10, step: 2, unit: 'min' });
		expect(habit.goal).toBeUndefined();
		expect(typeof habit.id).toBe('string');
		expect(habit.id.length).toBeGreaterThan(0);
		expect(typeof habit.seed).toBe('number');
		expect(typeof habit.createdAt).toBe('number');
	});

	test('respects explicit overrides instead of guessing', () => {
		const habit = buildHabit({
			id: 'fixed-id',
			name: 'Course 10 km',
			family: 'ranunculus',
			seed: 999,
			cadence: 'objectif',
			daily: { target: 5, step: 1, unit: 'km' },
			goal: { start: 1, current: 4, target: 10, unit: 'km' }
		});

		expect(habit).toMatchObject({
			id: 'fixed-id',
			family: 'ranunculus',
			seed: 999,
			cadence: 'objectif',
			daily: { target: 5, step: 1, unit: 'km' },
			goal: { start: 1, current: 4, target: 10, unit: 'km' }
		});
	});

	test('adapting a habit only patches the given fields (same id is preserved by the caller)', () => {
		const original = buildHabit({ name: 'Sport' });
		const adapted = buildHabit({ ...original, daily: { target: 2, step: 1, unit: 'fois' } });

		expect(adapted.id).toBe(original.id);
		expect(adapted.family).toBe(original.family);
		expect(adapted.daily).toEqual({ target: 2, step: 1, unit: 'fois' });
	});
});

describe('defaultDaily', () => {
	test('matches the MECHANICS.md daily targets for each flower family', () => {
		expect(defaultDaily('meditation')).toEqual({ target: 10, step: 2, unit: 'min' });
		expect(defaultDaily('water')).toEqual({ target: 2, step: 0.25, unit: 'L', isLiquid: true });
		expect(defaultDaily('poppy')).toEqual({ target: 30, step: 5, unit: 'min' });
		expect(defaultDaily('cosmos')).toEqual({ target: 5, step: 1, unit: 'km' });
		expect(defaultDaily('ranunculus')).toEqual({ target: 120, step: 15, unit: 's' });
	});
});
