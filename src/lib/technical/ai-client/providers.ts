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
