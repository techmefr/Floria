import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HabitDetailScreen from './HabitDetailScreen.svelte';
import type { IHabit, ILog } from './types';

const HABIT: IHabit = {
	id: 'medit',
	name: 'Méditation',
	family: 'meditation',
	cadence: 'quotidien',
	daily: { target: 10, step: 2, unit: 'min' },
	seed: 101,
	createdAt: Date.now()
};

describe('HabitDetailScreen', () => {
	test('shows today progress and reports +/- adjustments using the habit step', async () => {
		const onAdjustToday = vi.fn();
		const screen = render(HabitDetailScreen, {
			props: {
				habit: HABIT,
				logs: [] as ILog[],
				flowerStyle: 'aquarelle',
				onAdjustToday,
				onAdapt: vi.fn(),
				onBack: vi.fn()
			}
		});

		await expect.element(screen.getByText('0:00 / 10:00')).toBeInTheDocument();

		await screen.getByRole('button', { name: '+ 2 min' }).click();
		expect(onAdjustToday).toHaveBeenCalledWith(2);

		await screen.getByRole('button', { name: '−' }).click();
		expect(onAdjustToday).toHaveBeenCalledWith(-2);
	});

	test('shows the wake button and hides the session CTA once asleep', async () => {
		const onWake = vi.fn();
		const screen = render(HabitDetailScreen, {
			props: {
				habit: HABIT,
				logs: [] as ILog[],
				flowerStyle: 'aquarelle',
				sunCount: 0,
				onAdjustToday: vi.fn(),
				onWake,
				onAdapt: vi.fn(),
				onBack: vi.fn()
			}
		});

		await screen.getByRole('button', { name: 'La réveiller' }).click();
		expect(onWake).toHaveBeenCalledWith('medit');
	});

	test('renders a goal progress card only when the habit has a goal', async () => {
		const withGoal: IHabit = {
			...HABIT,
			id: 'course',
			cadence: 'objectif',
			goal: { start: 1, current: 4, target: 10, unit: 'km' }
		};

		const screen = render(HabitDetailScreen, {
			props: {
				habit: withGoal,
				logs: [] as ILog[],
				flowerStyle: 'aquarelle',
				onAdjustToday: vi.fn(),
				onAdapt: vi.fn(),
				onBack: vi.fn()
			}
		});

		await expect.element(screen.getByText('Là où tu en es')).toBeInTheDocument();
		await expect.element(screen.getByText('4 / 10 km')).toBeInTheDocument();
	});
});
