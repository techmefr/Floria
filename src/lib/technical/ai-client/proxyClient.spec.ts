import { describe, expect, test, vi } from 'vitest';
import { sendChatRequest } from './proxyClient';

function fakeFetch(response: { ok: boolean; status: number; body: unknown }) {
	return vi.fn(async () => ({
		ok: response.ok,
		status: response.status,
		json: async () => response.body
	})) as unknown as typeof fetch;
}

describe('sendChatRequest', () => {
	test('posts messages and tools as JSON and returns the parsed response', async () => {
		const fetchImpl = fakeFetch({
			ok: true,
			status: 200,
			body: { message: 'Bonjour', toolCalls: [] }
		});

		const result = await sendChatRequest(
			'https://proxy.floria.app/chat',
			{ messages: [{ role: 'user', content: 'Salut' }] },
			fetchImpl
		);

		expect(result).toEqual({ message: 'Bonjour', toolCalls: [] });
		expect(fetchImpl).toHaveBeenCalledWith(
			'https://proxy.floria.app/chat',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: [{ role: 'user', content: 'Salut' }] })
			})
		);
	});

	test('throws when the proxy responds with a non-ok status', async () => {
		const fetchImpl = fakeFetch({ ok: false, status: 500, body: {} });

		await expect(
			sendChatRequest('https://proxy.floria.app/chat', { messages: [] }, fetchImpl)
		).rejects.toThrow('AI proxy request failed with status 500');
	});
});
