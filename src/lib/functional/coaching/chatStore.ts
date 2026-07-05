import { get, writable, type Writable } from 'svelte/store';
import {
	sendChatRequest,
	runToolCalls,
	type ToolRegistry,
	type IChatMessage
} from '$lib/technical/ai-client';
import {
	appendUserTurn,
	appendAssistantTurn,
	extractSuggestions,
	type IChatTurn
} from './chatFlow';
import { HABIT_TOOL_DEFINITIONS } from './habitTools';

export interface IChatStore {
	turns: Writable<IChatTurn[]>;
	isLoading: Writable<boolean>;
	send(text: string): Promise<void>;
}

export function createChatStore(
	proxyUrl: string,
	tools: ToolRegistry,
	fetchImpl: typeof fetch = fetch
): IChatStore {
	const turns = writable<IChatTurn[]>([]);
	const isLoading = writable(false);

	async function send(text: string): Promise<void> {
		turns.update((current) => appendUserTurn(current, text));
		isLoading.set(true);

		try {
			const messages: IChatMessage[] = get(turns).map((turn) => ({
				role: turn.role,
				content: turn.text
			}));

			const response = await sendChatRequest(
				proxyUrl,
				{ messages, tools: HABIT_TOOL_DEFINITIONS },
				fetchImpl
			);

			const results = response.toolCalls.length
				? await runToolCalls(response.toolCalls, tools)
				: [];

			turns.update((current) =>
				appendAssistantTurn(current, response.message, extractSuggestions(results))
			);
		} finally {
			isLoading.set(false);
		}
	}

	return { turns, isLoading, send };
}
