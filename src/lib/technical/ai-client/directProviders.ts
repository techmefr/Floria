import type { IChatMessage, IChatResponse } from './types';

export type AiProvider = 'claude' | 'openai' | 'gemini' | 'mistral' | 'mammouth';

export interface IProviderOption {
	id: AiProvider;
	label: string;
}

export const AI_PROVIDERS: IProviderOption[] = [
	{ id: 'claude', label: 'Claude' },
	{ id: 'openai', label: 'ChatGPT' },
	{ id: 'gemini', label: 'Gemini' },
	{ id: 'mistral', label: 'Mixtral' },
	{ id: 'mammouth', label: 'Mammouth' }
];

export const ACCOMPAGNEMENT_SYSTEM_PROMPT =
	"Tu es l'accompagnement doux de l'application Floria, une app de suivi d'habitudes. " +
	'Ton ton est neutre, sans jugement, jamais culpabilisant. Reformule les échecs sans dramatiser ' +
	'(jamais "raté", "perdu", "streak brisé"). Pose des questions ouvertes, propose plutôt ' +
	"qu'imposer. Réponds en français, en quelques phrases.";

function toPlainText(messages: IChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
	return messages
		.filter((m) => m.role !== 'system')
		.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
}

async function sendClaude(
	apiKey: string,
	messages: IChatMessage[],
	fetchImpl: typeof fetch
): Promise<IChatResponse> {
	const response = await fetchImpl('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01',
			'anthropic-dangerous-direct-browser-access': 'true'
		},
		body: JSON.stringify({
			model: 'claude-sonnet-5',
			max_tokens: 1024,
			system: ACCOMPAGNEMENT_SYSTEM_PROMPT,
			messages: toPlainText(messages)
		})
	});

	if (!response.ok) {
		throw new Error(`Claude request failed with status ${response.status}`);
	}

	const data = await response.json();
	return { message: data.content?.[0]?.text ?? '', toolCalls: [] };
}

async function sendOpenAiCompatible(
	apiKey: string,
	messages: IChatMessage[],
	fetchImpl: typeof fetch,
	url: string,
	model: string
): Promise<IChatResponse> {
	const response = await fetchImpl(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [
				{ role: 'system', content: ACCOMPAGNEMENT_SYSTEM_PROMPT },
				...toPlainText(messages)
			]
		})
	});

	if (!response.ok) {
		throw new Error(`${model} request failed with status ${response.status}`);
	}

	const data = await response.json();
	return { message: data.choices?.[0]?.message?.content ?? '', toolCalls: [] };
}

async function sendGemini(
	apiKey: string,
	messages: IChatMessage[],
	fetchImpl: typeof fetch
): Promise<IChatResponse> {
	const contents = toPlainText(messages).map((m) => ({
		role: m.role === 'assistant' ? 'model' : 'user',
		parts: [{ text: m.content }]
	}));

	const response = await fetchImpl(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				contents,
				systemInstruction: { parts: [{ text: ACCOMPAGNEMENT_SYSTEM_PROMPT }] }
			})
		}
	);

	if (!response.ok) {
		throw new Error(`Gemini request failed with status ${response.status}`);
	}

	const data = await response.json();
	return { message: data.candidates?.[0]?.content?.parts?.[0]?.text ?? '', toolCalls: [] };
}

export async function sendDirectChatRequest(
	provider: AiProvider,
	apiKey: string,
	messages: IChatMessage[],
	fetchImpl: typeof fetch = fetch
): Promise<IChatResponse> {
	switch (provider) {
		case 'claude':
			return sendClaude(apiKey, messages, fetchImpl);
		case 'openai':
			return sendOpenAiCompatible(
				apiKey,
				messages,
				fetchImpl,
				'https://api.openai.com/v1/chat/completions',
				'gpt-4o-mini'
			);
		case 'mistral':
			return sendOpenAiCompatible(
				apiKey,
				messages,
				fetchImpl,
				'https://api.mistral.ai/v1/chat/completions',
				'open-mixtral-8x22b'
			);
		case 'mammouth':
			return sendOpenAiCompatible(
				apiKey,
				messages,
				fetchImpl,
				'https://api.mammouth.ai/v1/chat/completions',
				'mammouth'
			);
		case 'gemini':
			return sendGemini(apiKey, messages, fetchImpl);
	}
}
