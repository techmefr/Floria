import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Flower from './Flower.svelte';
import { makeFlower } from './engine';

describe('Flower', () => {
	test('renders one <g> per petal and applies the right watercolor filter', async () => {
		const model = makeFlower('poppy', 303, 1, 'encre', 0.6);
		const screen = render(Flower, {
			props: { family: 'poppy', seed: 303, bloom: 1, style: 'encre', intensity: 0.6, size: 64 }
		});

		const svg = screen.container.querySelector('svg');
		expect(svg?.querySelectorAll('g[transform^="rotate("]').length).toBe(model.petals.length);

		const outerGroup = screen.container.querySelector('g[filter]');
		expect(outerGroup?.getAttribute('filter')).toBe('url(#wc-ink)');
	});

	test('renders exactly one dark center circle for a dark family, none for a light one', async () => {
		const poppyModel = makeFlower('poppy', 1, 1, 'aquarelle');
		const waterModel = makeFlower('water', 1, 1, 'aquarelle');

		const poppy = render(Flower, {
			props: { family: 'poppy', seed: 1, bloom: 1, style: 'aquarelle', size: 32 }
		});
		const water = render(Flower, {
			props: { family: 'water', seed: 1, bloom: 1, style: 'aquarelle', size: 32 }
		});

		const poppyCircleCount = poppy.container.querySelectorAll('circle').length;
		const waterCircleCount = water.container.querySelectorAll('circle').length;

		expect(poppyCircleCount).toBe(poppyModel.stamens.length + 2);
		expect(waterCircleCount).toBe(waterModel.stamens.length + 1);
	});
});
