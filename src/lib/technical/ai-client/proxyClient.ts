import type { IChatMessage, IChatResponse, IToolDefinition } from './types';

export interface ISendChatRequestParams {
	messages: IChatMessage[];
	tools?: IToolDefinition[];
}

export async function sendChatRequest(
	proxyUrl: string,
	params: ISendChatRequestParams,
	fetchImpl: typeof fetch = fetch
): Promise<IChatResponse> {
	const response = await fetchImpl(proxyUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params)
	});

	if (!response.ok) {
		throw new Error(`AI proxy request failed with status ${response.status}`);
	}

	return (await response.json()) as IChatResponse;
}
