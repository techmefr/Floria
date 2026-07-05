import { describe, expect, test } from 'vitest';
import { appendUserTurn, appendAssistantTurn, extractSuggestions } from './chatFlow';
import type { IHabit } from '$lib/functional/habits';

const HABIT: IHabit = {
	id: 'medit',
	name: 'Méditation',
	family: 'meditation',
	cadence: 'quotidien',
	daily: { target: 10, step: 2, unit: 'min' },
	seed: 101,
	createdAt: 0
};

describe('appendUserTurn', () => {
	test('appends a user turn with no suggestions', () => {
		const turns = appendUserTurn([], 'Salut', 'turn-1');

		expect(turns).toEqual([{ id: 'turn-1', role: 'user', text: 'Salut', suggestions: [] }]);
	});
});

describe('appendAssistantTurn', () => {
	test('appends an assistant turn carrying its suggestion cards', () => {
		const turns = appendAssistantTurn([], 'Voici une idée', [HABIT], 'turn-2');

		expect(turns).toEqual([
			{ id: 'turn-2', role: 'assistant', text: 'Voici une idée', suggestions: [HABIT] }
		]);
	});

	test('defaults to no suggestions', () => {
		const [turn] = appendAssistantTurn([], 'Bonjour', undefined, 'turn-3');
		expect(turn.suggestions).toEqual([]);
	});
});

describe('extractSuggestions', () => {
	test('keeps only habit-shaped tool results', () => {
		const results = [
			{ result: HABIT },
			{ result: ['medit'] },
			{ result: { id: 'x' } },
			{ result: null }
		];

		expect(extractSuggestions(results)).toEqual([HABIT]);
	});
});
