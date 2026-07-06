<script lang="ts">
	import { get } from 'svelte/store';
	import { buildHabit, type IHabit } from '$lib/functional/habits';
	import {
		ChatScreen,
		createChatStore,
		createHabitTools,
		HABIT_TOOL_DEFINITIONS
	} from '$lib/functional/coaching';
	import {
		sendChatRequest,
		sendDirectChatRequest,
		type IChatMessage
	} from '$lib/technical/ai-client';
	import { getAppStores } from '../appStores';

	const stores = getAppStores();
	const habits = stores.habits.habits;
	const preferences = stores.preferences.preferences;

	const proxyUrl = import.meta.env.VITE_AI_PROXY_URL ?? '/api/chat';

	const habitTools = createHabitTools({
		listHabits: () => get(habits),
		getHabit: (id) => get(habits).find((h) => h.id === id),
		buildSuggestion: buildHabit
	});

	function transport(messages: IChatMessage[]) {
		const prefs = get(preferences);
		if (prefs.aiProvider && prefs.aiApiKey) {
			return sendDirectChatRequest(prefs.aiProvider, prefs.aiApiKey, messages);
		}
		return sendChatRequest(proxyUrl, { messages, tools: HABIT_TOOL_DEFINITIONS });
	}

	const chat = createChatStore(transport, habitTools);
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

{#if !$preferences.aiProvider}
	<p class="notice">
		Configure une clé API IA dans ton profil pour activer l’accompagnement — sinon les messages
		resteront sans réponse.
	</p>
{/if}

<ChatScreen
	turns={$turns}
	isLoading={$isLoading}
	onSend={handleSend}
	onAcceptSuggestion={handleAcceptSuggestion}
	onAdjustSuggestion={handleAdjustSuggestion}
/>

<style>
	.notice {
		font-family: var(--font-title);
		font-style: italic;
		font-size: 13px;
		color: var(--color-text-italic);
		text-align: center;
		margin: 4px 0 12px;
	}
</style>
