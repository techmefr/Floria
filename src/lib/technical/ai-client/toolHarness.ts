import type { IToolCall } from './types';

export type ToolHandler = (args: Record<string, unknown>) => unknown | Promise<unknown>;
export type ToolRegistry = Record<string, ToolHandler>;

export interface IToolCallResult {
	name: string;
	result: unknown;
}

export async function runToolCalls(
	toolCalls: IToolCall[],
	registry: ToolRegistry
): Promise<IToolCallResult[]> {
	const results: IToolCallResult[] = [];

	for (const call of toolCalls) {
		const handler = registry[call.name];
		if (!handler) {
			throw new Error(`No handler registered for tool "${call.name}"`);
		}
		results.push({ name: call.name, result: await handler(call.arguments) });
	}

	return results;
}
