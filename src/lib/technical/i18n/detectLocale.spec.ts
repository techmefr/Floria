import { describe, expect, test } from 'vitest';
import { detectDeviceLocale } from './detectLocale';

describe('detectDeviceLocale', () => {
	test('picks the first supported language, ignoring region', () => {
		expect(detectDeviceLocale(['en-US', 'fr-FR'])).toBe('en');
	});

	test('falls back to fr when nothing matches', () => {
		expect(detectDeviceLocale(['de-DE', 'it-IT'])).toBe('fr');
	});

	test('falls back to fr for an empty language list', () => {
		expect(detectDeviceLocale([])).toBe('fr');
	});
});
