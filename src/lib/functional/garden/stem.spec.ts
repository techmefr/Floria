import { describe, expect, test } from 'vitest';
import { stem } from './stem';

describe('stem', () => {
	test('starts the path at the plot base and ends at the flower position', () => {
		const model = stem(62, 300, 58, 150);

		expect(model.pathD.startsWith('M 62 300')).toBe(true);
		expect(model.pathD.endsWith('58 150')).toBe(true);
	});

	test('places the leaf at the vertical midpoint between base and flower', () => {
		const model = stem(62, 300, 58, 150);

		expect(model.leaf.cy).toBe((300 + 150) / 2);
	});
});
