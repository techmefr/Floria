import { describe, expect, test, vi } from 'vitest';
import { sendDirectChatRequest } from './directProviders';
import type { IChatMessage } from './types';

const MESSAGES: IChatMessage[] = [{ role: 'user', content: 'Salut' }];

function fakeFetch(body: unknown, ok = true, status = 200) {
	const fn = vi.fn(async () => ({ ok, status, json: async () => body }));
	return fn as unknown as typeof fetch;
}

describe('sendDirectChatRequest', () => {
	test('claude: sends x-api-key and the browser-access header, parses content[0].text', async () => {
		const fetchImpl = fakeFetch({ content: [{ text: 'Bonjour' }] });

		const result = await sendDirectChatRequest('claude', 'key-123', MESSAGES, fetchImpl);

		expect(result).toEqual({ message: 'Bonjour', toolCalls: [] });
		const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(url).toBe('https://api.anthropic.com/v1/messages');
		expect(init.headers['x-api-key']).toBe('key-123');
		expect(init.headers['anthropic-dangerous-direct-browser-access']).toBe('true');
	});

	test('openai: sends a bearer token and parses choices[0].message.content', async () => {
		const fetchImpl = fakeFetch({ choices: [{ message: { content: 'Bonjour' } }] });

		const result = await sendDirectChatRequest('openai', 'key-123', MESSAGES, fetchImpl);

		expect(result).toEqual({ message: 'Bonjour', toolCalls: [] });
		const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(url).toBe('https://api.openai.com/v1/chat/completions');
		expect(init.headers.authorization).toBe('Bearer key-123');
	});

	test('mistral: calls the Mistral endpoint with the Mixtral model', async () => {
		const fetchImpl = fakeFetch({ choices: [{ message: { content: 'Bonjour' } }] });

		await sendDirectChatRequest('mistral', 'key-123', MESSAGES, fetchImpl);

		const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(url).toBe('https://api.mistral.ai/v1/chat/completions');
		expect(JSON.parse(init.body).model).toBe('open-mixtral-8x22b');
	});

	test('gemini: puts the key in the query string and maps assistant to model role', async () => {
		const fetchImpl = fakeFetch({ candidates: [{ content: { parts: [{ text: 'Bonjour' }] } }] });

		const result = await sendDirectChatRequest('gemini', 'key-123', MESSAGES, fetchImpl);

		expect(result).toEqual({ message: 'Bonjour', toolCalls: [] });
		const [url] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(url).toContain('key=key-123');
	});

	test('throws with the status code when a provider responds with an error', async () => {
		const fetchImpl = fakeFetch({}, false, 401);

		await expect(sendDirectChatRequest('openai', 'bad-key', MESSAGES, fetchImpl)).rejects.toThrow(
			'401'
		);
	});
});
