import { describe, expect, test } from 'vitest';
import { applyFontScale, applyHighContrast, applyReduceMotion } from './applyToRoot';

function createFakeRoot() {
	const properties = new Map<string, string>();
	const attributes = new Map<string, string>();

	return {
		properties,
		attributes,
		style: {
			setProperty: (name: string, value: string) => properties.set(name, value)
		},
		setAttribute: (name: string, value: string) => attributes.set(name, value),
		removeAttribute: (name: string) => attributes.delete(name)
	};
}

describe('applyFontScale', () => {
	test('writes --font-scale as a string', () => {
		const root = createFakeRoot();

		applyFontScale(root, 1.15);

		expect(root.properties.get('--font-scale')).toBe('1.15');
	});
});

describe('applyHighContrast', () => {
	test('sets data-high-contrast when enabled', () => {
		const root = createFakeRoot();

		applyHighContrast(root, true);

		expect(root.attributes.get('data-high-contrast')).toBe('true');
	});

	test('removes data-high-contrast when disabled', () => {
		const root = createFakeRoot();
		root.attributes.set('data-high-contrast', 'true');

		applyHighContrast(root, false);

		expect(root.attributes.has('data-high-contrast')).toBe(false);
	});
});

describe('applyReduceMotion', () => {
	test('sets data-reduce-motion when enabled', () => {
		const root = createFakeRoot();

		applyReduceMotion(root, true);

		expect(root.attributes.get('data-reduce-motion')).toBe('true');
	});

	test('removes data-reduce-motion when disabled', () => {
		const root = createFakeRoot();
		root.attributes.set('data-reduce-motion', 'true');

		applyReduceMotion(root, false);

		expect(root.attributes.has('data-reduce-motion')).toBe(false);
	});
});
