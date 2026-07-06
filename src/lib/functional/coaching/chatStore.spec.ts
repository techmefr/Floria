import { describe, expect, test, vi } from 'vitest';
import { get } from 'svelte/store';
import { createChatStore } from './chatStore';
import type { IHabit } from '$lib/functional/habits';
import type { IChatResponse } from '$lib/technical/ai-client';

describe('createChatStore', () => {
	test('send appends the user turn, then the assistant reply once it resolves', async () => {
		const transport = vi.fn(async (): Promise<IChatResponse> => ({
			message: 'Bonjour, on en parle ?',
			toolCalls: []
		}));
		const store = createChatStore(transport, {});

		const sendPromise = store.send('Salut');
		expect(get(store.isLoading)).toBe(true);
		await sendPromise;

		expect(get(store.isLoading)).toBe(false);
		const turns = get(store.turns);
		expect(turns).toHaveLength(2);
		expect(turns[0]).toMatchObject({ role: 'user', text: 'Salut' });
		expect(turns[1]).toMatchObject({ role: 'assistant', text: 'Bonjour, on en parle ?' });
	});

	test('runs tool calls and attaches the resulting habit as a suggestion card', async () => {
		const suggestedHabit: IHabit = {
			id: 'new-id',
			name: 'Étirements',
			family: 'poppy',
			cadence: 'quotidien',
			daily: { target: 1, step: 1, unit: 'fois' },
			seed: 42,
			createdAt: 0
		};

		const transport = vi.fn(async (): Promise<IChatResponse> => ({
			message: 'Voici une proposition',
			toolCalls: [{ name: 'proposer_habitude', arguments: { name: 'Étirements' } }]
		}));

		const store = createChatStore(transport, { proposer_habitude: () => suggestedHabit });

		await store.send('Propose-moi quelque chose de doux');

		const [, assistantTurn] = get(store.turns);
		expect(assistantTurn.suggestions).toEqual([suggestedHabit]);
	});

	test('resets isLoading even if the transport rejects', async () => {
		const transport = vi.fn(async (): Promise<IChatResponse> => {
			throw new Error('network down');
		});

		const store = createChatStore(transport, {});

		await expect(store.send('Salut')).rejects.toThrow('network down');
		expect(get(store.isLoading)).toBe(false);
	});
});
