<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { HabitDetailScreen } from '$lib/functional/habits';
	import { getAppStores } from '../../appStores';

	const stores = getAppStores();
	const habits = stores.habits.habits;
	const logs = stores.habits.logs;
	const preferences = stores.preferences.preferences;
	const suns = stores.session.suns;

	let habitId = $derived($page.params.id);
	let habit = $derived($habits.find((h) => h.id === habitId));

	function handleAdjustToday(delta: number): void {
		if (!habit) return;
		void stores.habits.addLog({
			id: crypto.randomUUID(),
			habitId: habit.id,
			ts: Date.now(),
			amount: delta
		});
	}

	function handleStartSession(id: string): void {
		void goto(resolve('/session/[id]', { id }));
	}

	function handleWake(id: string): void {
		void goto(resolve('/session/[id]', { id }));
	}

	function handleAdapt(id: string): void {
		void goto(resolve(`/nouveau?habitId=${id}`));
	}

	function handleBack(): void {
		void goto(resolve('/'));
	}
</script>

{#if habit}
	<HabitDetailScreen
		{habit}
		logs={$logs}
		flowerStyle={$preferences.flowerStyle}
		sunCount={$suns[habit.id] ?? 3}
		isReduceMotion={$preferences.reduceMotion}
		onAdjustToday={handleAdjustToday}
		onStartSession={handleStartSession}
		onWake={handleWake}
		onAdapt={handleAdapt}
		onBack={handleBack}
	/>
{:else}
	<p>Habitude introuvable.</p>
{/if}
