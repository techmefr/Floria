import { describe, expect, test, vi } from 'vitest';
import { get } from 'svelte/store';
import { createChatStore } from './chatStore';
import type { IHabit } from '$lib/functional/habits';

function fakeFetch(body: unknown) {
	return vi.fn(async () => ({
		ok: true,
		status: 200,
		json: async () => body
	})) as unknown as typeof fetch;
}

describe('createChatStore', () => {
	test('send appends the user turn, then the assistant reply once it resolves', async () => {
		const fetchImpl = fakeFetch({ message: 'Bonjour, on en parle ?', toolCalls: [] });
		const store = createChatStore('https://proxy.floria.app/chat', {}, fetchImpl);

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

		const fetchImpl = fakeFetch({
			message: 'Voici une proposition',
			toolCalls: [{ name: 'proposer_habitude', arguments: { name: 'Étirements' } }]
		});

		const store = createChatStore(
			'https://proxy.floria.app/chat',
			{ proposer_habitude: () => suggestedHabit },
			fetchImpl
		);

		await store.send('Propose-moi quelque chose de doux');

		const [, assistantTurn] = get(store.turns);
		expect(assistantTurn.suggestions).toEqual([suggestedHabit]);
	});

	test('resets isLoading even if the request fails', async () => {
		const fetchImpl = vi.fn(async () => ({
			ok: false,
			status: 500,
			json: async () => ({})
		})) as unknown as typeof fetch;

		const store = createChatStore('https://proxy.floria.app/chat', {}, fetchImpl);

		await expect(store.send('Salut')).rejects.toThrow();
		expect(get(store.isLoading)).toBe(false);
	});
});
