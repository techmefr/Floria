import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ChatScreen from './ChatScreen.svelte';
import type { IChatTurn } from './chatFlow';
import type { IHabit } from '$lib/functional/habits';

const SUGGESTED_HABIT: IHabit = {
	id: 'new-id',
	name: 'Étirements',
	family: 'poppy',
	cadence: 'quotidien',
	daily: { target: 1, step: 1, unit: 'fois' },
	seed: 42,
	createdAt: 0
};

const TURNS: IChatTurn[] = [
	{ id: '1', role: 'user', text: 'Salut', suggestions: [] },
	{
		id: '2',
		role: 'assistant',
		text: 'Voici une proposition',
		suggestions: [SUGGESTED_HABIT]
	}
];

describe('ChatScreen', () => {
	test('typing and submitting sends the trimmed draft', async () => {
		const onSend = vi.fn();
		const screen = render(ChatScreen, {
			props: {
				turns: [],
				onSend,
				onAcceptSuggestion: vi.fn(),
				onAdjustSuggestion: vi.fn()
			}
		});

		await screen.getByPlaceholder('Écris ici…').fill('  Bonjour  ');
		await screen.getByRole('button', { name: 'Envoyer' }).click();

		expect(onSend).toHaveBeenCalledWith('Bonjour');
	});

	test('a quick reply sends its own text directly', async () => {
		const onSend = vi.fn();
		const screen = render(ChatScreen, {
			props: { turns: [], onSend, onAcceptSuggestion: vi.fn(), onAdjustSuggestion: vi.fn() }
		});

		await screen.getByRole('button', { name: 'Lister mes habitudes' }).click();

		expect(onSend).toHaveBeenCalledWith('Lister mes habitudes');
	});

	test('accepting a suggestion reports the habit and flips the button to Adopté', async () => {
		const onAcceptSuggestion = vi.fn();
		const screen = render(ChatScreen, {
			props: {
				turns: TURNS,
				onSend: vi.fn(),
				onAcceptSuggestion,
				onAdjustSuggestion: vi.fn()
			}
		});

		await screen.getByRole('button', { name: 'Ajouter à mon jardin' }).click();

		expect(onAcceptSuggestion).toHaveBeenCalledWith(SUGGESTED_HABIT);
		await expect.element(screen.getByText('✓ Adopté')).toBeInTheDocument();
	});
});
