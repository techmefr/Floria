import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PrairieGarden from './PrairieGarden.svelte';
import type { IGardenPlant } from './gardenPlant';

const PLANTS: IGardenPlant[] = [
	{
		habitId: 'medit',
		name: 'Méditation',
		cadence: 'Chaque matin',
		family: 'meditation',
		seed: 101,
		consistency: 0.7,
		recentEnergy: 0.6,
		isDoneToday: false
	},
	{
		habitId: 'sport',
		name: 'Sport',
		cadence: '3x / semaine',
		family: 'poppy',
		seed: 303,
		consistency: 0.4,
		recentEnergy: 0.5,
		isDoneToday: true
	}
];

describe('PrairieGarden', () => {
	test('renders one clickable plant per habit and reports the tapped habit', async () => {
		const onSelect = vi.fn();
		const screen = render(PrairieGarden, {
			props: { plants: PLANTS, flowerStyle: 'aquarelle', onSelect }
		});

		expect(screen.container.querySelectorAll('g[role="button"]').length).toBe(PLANTS.length);

		await screen.getByRole('button', { name: 'Sport' }).click();

		expect(onSelect).toHaveBeenCalledWith('sport');
	});
});
