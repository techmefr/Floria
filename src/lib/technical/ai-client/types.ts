export type ChatRole = 'user' | 'assistant' | 'system';

export interface IChatMessage {
	role: ChatRole;
	content: string;
}

export interface IToolDefinition {
	name: string;
	description: string;
	parameters: Record<string, unknown>;
}

export interface IToolCall {
	name: string;
	arguments: Record<string, unknown>;
}

export interface IChatResponse {
	message: string;
	toolCalls: IToolCall[];
}
