<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { NouveauScreen, buildHabit, type IHabitDraft } from '$lib/functional/habits';
	import { getAppStores } from '../appStores';

	const stores = getAppStores();
	const habits = stores.habits.habits;
	const preferences = stores.preferences.preferences;

	let editingHabitId = $derived($page.url.searchParams.get('habitId'));
	let editingHabit = $derived($habits.find((h) => h.id === editingHabitId));

	async function handleSubmit(draft: IHabitDraft): Promise<void> {
		if (editingHabit) {
			await stores.habits.updateHabit(editingHabit.id, draft);
		} else {
			await stores.habits.addHabit(buildHabit(draft));
		}
		void goto(resolve('/'));
	}

	function handleBack(): void {
		void goto(resolve('/'));
	}
</script>

<NouveauScreen
	initialName={editingHabit?.name}
	initialFamily={editingHabit?.family}
	initialCadence={editingHabit?.cadence}
	flowerStyle={$preferences.flowerStyle}
	isEditing={Boolean(editingHabit)}
	onSubmit={handleSubmit}
	onBack={handleBack}
/>
