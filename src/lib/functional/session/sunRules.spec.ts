import { describe, expect, test } from 'vitest';
import { gainSun, loseSun, vitality, plantState } from './sunRules';

describe('gainSun', () => {
	test('increments by one', () => {
		expect(gainSun(1)).toBe(2);
	});

	test('caps at 3', () => {
		expect(gainSun(3)).toBe(3);
	});
});

describe('loseSun', () => {
	test('decrements by one', () => {
		expect(loseSun(2)).toBe(1);
	});

	test('floors at 0', () => {
		expect(loseSun(0)).toBe(0);
	});
});

describe('vitality', () => {
	test('is suns divided by 3', () => {
		expect(vitality(3)).toBe(1);
		expect(vitality(0)).toBe(0);
		expect(vitality(1)).toBeCloseTo(1 / 3);
	});
});

describe('plantState', () => {
	test('maps each sun count to its named state', () => {
		expect(plantState(3)).toBe('epanouie');
		expect(plantState(2)).toBe('sereine');
		expect(plantState(1)).toBe('fatiguee');
		expect(plantState(0)).toBe('assoupie');
	});
});
