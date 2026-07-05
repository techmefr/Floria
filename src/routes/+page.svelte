<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { GardenScreen, todayAmount, toggleAmount } from '$lib/functional/habits';
	import { getAppStores } from './appStores';

	const stores = getAppStores();
	const habits = stores.habits.habits;
	const logs = stores.habits.logs;
	const preferences = stores.preferences.preferences;

	function handleToggleToday(habitId: string): void {
		const habit = $habits.find((h) => h.id === habitId);
		if (!habit) return;

		const delta = toggleAmount(todayAmount(habit, $logs), habit.daily.target);
		void stores.habits.addLog({
			id: crypto.randomUUID(),
			habitId,
			ts: Date.now(),
			amount: delta
		});
	}

	function handleSelectHabit(habitId: string): void {
		void goto(resolve('/habitude/[id]', { id: habitId }));
	}
</script>

<GardenScreen
	habits={$habits}
	logs={$logs}
	flowerStyle={$preferences.flowerStyle}
	gardenLayout={$preferences.gardenLayout}
	isReduceMotion={$preferences.reduceMotion}
	onToggleToday={handleToggleToday}
	onSelectHabit={handleSelectHabit}
/>
