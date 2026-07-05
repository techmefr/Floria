<script lang="ts">
	import { get } from 'svelte/store';
	import { buildHabit, type IHabit } from '$lib/functional/habits';
	import { ChatScreen, createChatStore, createHabitTools } from '$lib/functional/coaching';
	import { getAppStores } from '../appStores';

	const stores = getAppStores();
	const habits = stores.habits.habits;

	const proxyUrl = import.meta.env.VITE_AI_PROXY_URL ?? '/api/chat';

	const habitTools = createHabitTools({
		listHabits: () => get(habits),
		getHabit: (id) => get(habits).find((h) => h.id === id),
		buildSuggestion: buildHabit
	});

	const chat = createChatStore(proxyUrl, habitTools);
	const turns = chat.turns;
	const isLoading = chat.isLoading;

	function handleSend(text: string): void {
		void chat.send(text);
	}

	function handleAcceptSuggestion(habit: IHabit): void {
		void stores.habits.addHabit(habit);
	}

	function handleAdjustSuggestion(): void {
		void chat.send('Peux-tu ajuster cette proposition ?');
	}
</script>

<ChatScreen
	turns={$turns}
	isLoading={$isLoading}
	onSend={handleSend}
	onAcceptSuggestion={handleAcceptSuggestion}
	onAdjustSuggestion={handleAdjustSuggestion}
/>
