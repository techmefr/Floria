const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
	'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

type ChatRole = 'user' | 'assistant' | 'system';

interface IChatMessage {
	role: ChatRole;
	content: string;
}

interface IToolDefinition {
	name: string;
	description: string;
	parameters: Record<string, unknown>;
}

interface IToolCall {
	name: string;
	arguments: Record<string, unknown>;
}

interface IChatResponse {
	message: string;
	toolCalls: IToolCall[];
}

type Provider = 'claude' | 'openai' | 'gemini' | 'mistral' | 'mammouth';

interface IRequestBody {
	provider: Provider;
	apiKey: string;
	messages: IChatMessage[];
	tools?: IToolDefinition[];
}

function plainMessages(
	messages: IChatMessage[]
): { role: 'user' | 'assistant'; content: string }[] {
	return messages
		.filter((m) => m.role !== 'system')
		.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
}

const SYSTEM_PROMPT =
	"Tu es l'accompagnement doux de l'application Floria, une app de suivi d'habitudes. " +
	'Ton ton est neutre, sans jugement, jamais culpabilisant. Reformule les échecs sans dramatiser ' +
	'(jamais "raté", "perdu", "streak brisé"). Pose des questions ouvertes, propose plutôt ' +
	"qu'imposer. Réponds en français, en quelques phrases. Utilise les outils disponibles pour " +
	"proposer ou adapter une habitude plutôt que de décrire l'action en texte.";

async function callClaude(
	apiKey: string,
	messages: IChatMessage[],
	tools?: IToolDefinition[]
): Promise<IChatResponse> {
	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: 'claude-sonnet-5',
			max_tokens: 1024,
			system: SYSTEM_PROMPT,
			messages: plainMessages(messages),
			tools: tools?.map((t) => ({
				name: t.name,
				description: t.description,
				input_schema: t.parameters
			}))
		})
	});

	if (!response.ok) {
		throw new Error(
			`Claude request failed with status ${response.status}: ${await response.text()}`
		);
	}

	const data = await response.json();
	const blocks: Array<Record<string, unknown>> = data.content ?? [];
	const message = blocks
		.filter((b) => b.type === 'text')
		.map((b) => b.text as string)
		.join('');
	const toolCalls: IToolCall[] = blocks
		.filter((b) => b.type === 'tool_use')
		.map((b) => ({
			name: b.name as string,
			arguments: (b.input as Record<string, unknown>) ?? {}
		}));

	return { message, toolCalls };
}

async function callOpenAiCompatible(
	apiKey: string,
	messages: IChatMessage[],
	url: string,
	model: string,
	tools?: IToolDefinition[]
): Promise<IChatResponse> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...plainMessages(messages)],
			tools: tools?.map((t) => ({
				type: 'function',
				function: { name: t.name, description: t.description, parameters: t.parameters }
			}))
		})
	});

	if (!response.ok) {
		throw new Error(
			`${model} request failed with status ${response.status}: ${await response.text()}`
		);
	}

	const data = await response.json();
	const choiceMessage = data.choices?.[0]?.message ?? {};
	const toolCalls: IToolCall[] = (choiceMessage.tool_calls ?? []).map(
		(call: { function: { name: string; arguments: string } }) => ({
			name: call.function.name,
			arguments: JSON.parse(call.function.arguments || '{}')
		})
	);

	return { message: choiceMessage.content ?? '', toolCalls };
}

async function callGemini(
	apiKey: string,
	messages: IChatMessage[],
	tools?: IToolDefinition[]
): Promise<IChatResponse> {
	const contents = plainMessages(messages).map((m) => ({
		role: m.role === 'assistant' ? 'model' : 'user',
		parts: [{ text: m.content }]
	}));

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				contents,
				systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
				tools: tools?.length
					? [
							{
								functionDeclarations: tools.map((t) => ({
									name: t.name,
									description: t.description,
									parameters: t.parameters
								}))
							}
						]
					: undefined
			})
		}
	);

	if (!response.ok) {
		throw new Error(
			`Gemini request failed with status ${response.status}: ${await response.text()}`
		);
	}

	const data = await response.json();
	const parts: Array<Record<string, unknown>> = data.candidates?.[0]?.content?.parts ?? [];
	const message = parts
		.filter((p) => typeof p.text === 'string')
		.map((p) => p.text as string)
		.join('');
	const toolCalls: IToolCall[] = parts
		.filter((p) => p.functionCall)
		.map((p) => {
			const call = p.functionCall as { name: string; args: Record<string, unknown> };
			return { name: call.name, arguments: call.args ?? {} };
		});

	return { message, toolCalls };
}

async function routeToProvider(body: IRequestBody): Promise<IChatResponse> {
	switch (body.provider) {
		case 'claude':
			return callClaude(body.apiKey, body.messages, body.tools);
		case 'openai':
			return callOpenAiCompatible(
				body.apiKey,
				body.messages,
				'https://api.openai.com/v1/chat/completions',
				'gpt-4o-mini',
				body.tools
			);
		case 'mistral':
			return callOpenAiCompatible(
				body.apiKey,
				body.messages,
				'https://api.mistral.ai/v1/chat/completions',
				'open-mixtral-8x22b',
				body.tools
			);
		case 'mammouth':
			return callOpenAiCompatible(
				body.apiKey,
				body.messages,
				'https://api.mammouth.ai/v1/chat/completions',
				'mammouth',
				body.tools
			);
		case 'gemini':
			return callGemini(body.apiKey, body.messages, body.tools);
		default:
			throw new Error(`Unknown provider: ${body.provider}`);
	}
}

Deno.serve(async (req: Request) => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { headers: CORS_HEADERS });
	}

	try {
		const body = (await req.json()) as IRequestBody;

		if (!body.provider || !body.apiKey || !Array.isArray(body.messages)) {
			return new Response(JSON.stringify({ error: 'provider, apiKey and messages are required' }), {
				status: 400,
				headers: { ...CORS_HEADERS, 'content-type': 'application/json' }
			});
		}

		const result = await routeToProvider(body);

		return new Response(JSON.stringify(result), {
			headers: { ...CORS_HEADERS, 'content-type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: (error as Error).message }), {
			status: 500,
			headers: { ...CORS_HEADERS, 'content-type': 'application/json' }
		});
	}
});
