<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { formatPalierLabel } from '$lib/functional/habits';
	import { SessionView, sessionFraction, type ISessionPalier } from '$lib/functional/session';
	import { getAppStores } from '../../appStores';

	const stores = getAppStores();
	const habits = stores.habits.habits;
	const preferences = stores.preferences.preferences;
	const session = stores.session.session;

	let habitId = $derived($page.params.id);
	let habit = $derived($habits.find((h) => h.id === habitId));

	function durationSeconds(unit: string, target: number): number {
		return unit === 'min' ? target * 60 : target;
	}

	function clockLabel(unit: string, seconds: number): string {
		return unit === 'min'
			? formatPalierLabel(seconds / 60, 'min')
			: formatPalierLabel(seconds, 's');
	}

	onMount(() => {
		if (!habit) return;
		if ($session?.habitId === habit.id) return;
		void stores.session.start(habit.id, durationSeconds(habit.daily.unit, habit.daily.target));
	});

	let paliers = $derived.by((): ISessionPalier[] => {
		if (!habit || !$session) return [];
		const fraction = sessionFraction($session);
		return [0.25, 0.5, 0.75, 1].map((step) => ({
			label: clockLabel(habit!.daily.unit, $session!.duration * step),
			isReached: fraction >= step - 1e-9
		}));
	});

	function handlePause(): void {
		void stores.session.pause();
	}

	function handleResume(): void {
		void stores.session.resume();
	}

	async function handleStop(): Promise<void> {
		await stores.session.abandon();
		void goto(habit ? resolve('/habitude/[id]', { id: habit.id }) : resolve('/'));
	}

	async function handleReturnToGarden(): Promise<void> {
		if (!habit) return;
		await stores.session.complete();
		void stores.habits.addLog({
			id: crypto.randomUUID(),
			habitId: habit.id,
			ts: Date.now(),
			amount: habit.daily.target
		});
		void goto(resolve('/'));
	}

	function handleTick(): void {
		stores.session.tick();
	}
</script>

{#if habit && $session && $session.habitId === habit.id}
	<SessionView
		session={$session}
		habitName={habit.name}
		family={habit.family}
		seed={habit.seed}
		flowerStyle={$preferences.flowerStyle}
		elapsedLabel={clockLabel(habit.daily.unit, $session.elapsed)}
		targetLabel={clockLabel(habit.daily.unit, $session.duration)}
		{paliers}
		isReduceMotion={$preferences.reduceMotion}
		onPause={handlePause}
		onResume={handleResume}
		onStop={handleStop}
		onReturnToGarden={handleReturnToGarden}
		onTick={handleTick}
	/>
{/if}
