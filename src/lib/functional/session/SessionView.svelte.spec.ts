import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SessionView from './SessionView.svelte';
import type { ISessionState } from './sessionMachine';

const RUNNING_SESSION: ISessionState = {
	habitId: 'medit',
	startedAt: 0,
	elapsed: 300,
	duration: 600,
	running: true,
	done: false
};

describe('SessionView', () => {
	test('shows Pause while running and calls onPause when tapped', async () => {
		const onPause = vi.fn();
		const screen = render(SessionView, {
			props: {
				session: RUNNING_SESSION,
				habitName: 'Méditation',
				family: 'meditation',
				seed: 101,
				flowerStyle: 'aquarelle',
				elapsedLabel: '5:00',
				targetLabel: '10:00',
				paliers: [
					{ label: '2:30', isReached: true },
					{ label: '5:00', isReached: true },
					{ label: '7:30', isReached: false },
					{ label: '10:00', isReached: false }
				],
				onPause,
				onResume: vi.fn(),
				onStop: vi.fn(),
				onReturnToGarden: vi.fn(),
				onTick: vi.fn()
			}
		});

		await screen.getByRole('button', { name: 'Pause' }).click();
		expect(onPause).toHaveBeenCalled();
	});

	test('shows only "Retour au jardin" once the session is done', async () => {
		const onReturnToGarden = vi.fn();
		const screen = render(SessionView, {
			props: {
				session: { ...RUNNING_SESSION, elapsed: 600, running: false, done: true },
				habitName: 'Méditation',
				family: 'meditation',
				seed: 101,
				flowerStyle: 'aquarelle',
				elapsedLabel: '10:00',
				targetLabel: '10:00',
				paliers: [],
				onPause: vi.fn(),
				onResume: vi.fn(),
				onStop: vi.fn(),
				onReturnToGarden,
				onTick: vi.fn()
			}
		});

		expect(screen.container.querySelector('.controls')).toBeNull();

		await screen.getByRole('button', { name: 'Retour au jardin' }).click();
		expect(onReturnToGarden).toHaveBeenCalled();
	});

	test('ticks on an interval while running and stops ticking once paused', async () => {
		vi.useFakeTimers();
		const onTick = vi.fn();

		const screen = render(SessionView, {
			props: {
				session: RUNNING_SESSION,
				habitName: 'Méditation',
				family: 'meditation',
				seed: 101,
				flowerStyle: 'aquarelle',
				elapsedLabel: '5:00',
				targetLabel: '10:00',
				paliers: [],
				onPause: vi.fn(),
				onResume: vi.fn(),
				onStop: vi.fn(),
				onReturnToGarden: vi.fn(),
				onTick
			}
		});

		await vi.advanceTimersByTimeAsync(1000);
		expect(onTick.mock.calls.length).toBeGreaterThanOrEqual(3);

		await screen.rerender({
			session: { ...RUNNING_SESSION, running: false },
			habitName: 'Méditation',
			family: 'meditation',
			seed: 101,
			flowerStyle: 'aquarelle',
			elapsedLabel: '5:00',
			targetLabel: '10:00',
			paliers: [],
			onPause: vi.fn(),
			onResume: vi.fn(),
			onStop: vi.fn(),
			onReturnToGarden: vi.fn(),
			onTick
		});

		const callsAfterPause = onTick.mock.calls.length;
		await vi.advanceTimersByTimeAsync(1000);
		expect(onTick.mock.calls.length).toBe(callsAfterPause);

		vi.useRealTimers();
	});
});
