import { get, writable, type Writable } from 'svelte/store';
import {
	runToolCalls,
	type ToolRegistry,
	type IChatMessage,
	type IChatResponse
} from '$lib/technical/ai-client';
import {
	appendUserTurn,
	appendAssistantTurn,
	extractSuggestions,
	type IChatTurn
} from './chatFlow';

export type ChatTransport = (messages: IChatMessage[]) => Promise<IChatResponse>;

export interface IChatStore {
	turns: Writable<IChatTurn[]>;
	isLoading: Writable<boolean>;
	send(text: string): Promise<void>;
}

export function createChatStore(transport: ChatTransport, tools: ToolRegistry): IChatStore {
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

			const response = await transport(messages);

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
