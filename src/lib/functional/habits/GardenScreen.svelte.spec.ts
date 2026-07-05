import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import GardenScreen from './GardenScreen.svelte';
import type { IHabit, ILog } from './types';

const HABITS: IHabit[] = [
	{
		id: 'medit',
		name: 'Méditation',
		family: 'meditation',
		cadence: 'quotidien',
		daily: { target: 10, step: 2, unit: 'min' },
		seed: 101,
		createdAt: Date.now()
	},
	{
		id: 'sport',
		name: 'Sport',
		family: 'poppy',
		cadence: 'quotidien',
		daily: { target: 1, step: 1, unit: 'fois' },
		seed: 303,
		createdAt: Date.now()
	}
];

const LOGS: ILog[] = [{ id: 'l1', habitId: 'medit', ts: Date.now(), amount: 10 }];

describe('GardenScreen', () => {
	test('shows the done/total counter and lets you toggle a habit chip', async () => {
		const onToggleToday = vi.fn();
		const screen = render(GardenScreen, {
			props: {
				habits: HABITS,
				logs: LOGS,
				flowerStyle: 'aquarelle',
				gardenLayout: 'prairie',
				onToggleToday,
				onSelectHabit: vi.fn()
			}
		});

		await expect.element(screen.getByText('1 / 2')).toBeInTheDocument();

		const sportChip = screen.container.querySelectorAll('.chips button')[1] as HTMLButtonElement;
		sportChip.click();

		expect(onToggleToday).toHaveBeenCalledWith('sport');
	});

	test('selecting a plant in the garden reports its habit id', async () => {
		const onSelectHabit = vi.fn();
		const screen = render(GardenScreen, {
			props: {
				habits: HABITS,
				logs: LOGS,
				flowerStyle: 'aquarelle',
				gardenLayout: 'prairie',
				onToggleToday: vi.fn(),
				onSelectHabit
			}
		});

		const plants = screen.container.querySelectorAll('g[role="button"]');
		expect(plants.length).toBe(2);

		await (plants[0] as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));

		expect(onSelectHabit).toHaveBeenCalled();
	});
});
