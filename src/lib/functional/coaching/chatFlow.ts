import type { IHabit } from '$lib/functional/habits';

export interface IChatTurn {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	suggestions: IHabit[];
}

export function appendUserTurn(turns: IChatTurn[], text: string, id?: string): IChatTurn[] {
	return [...turns, { id: id ?? crypto.randomUUID(), role: 'user', text, suggestions: [] }];
}

export function appendAssistantTurn(
	turns: IChatTurn[],
	text: string,
	suggestions: IHabit[] = [],
	id?: string
): IChatTurn[] {
	return [...turns, { id: id ?? crypto.randomUUID(), role: 'assistant', text, suggestions }];
}

function isHabitLike(value: unknown): value is IHabit {
	return typeof value === 'object' && value !== null && 'id' in value && 'family' in value;
}

export function extractSuggestions(results: { result: unknown }[]): IHabit[] {
	return results.map((r) => r.result).filter(isHabitLike);
}
