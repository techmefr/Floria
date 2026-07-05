import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import NouveauScreen from './NouveauScreen.svelte';

describe('NouveauScreen', () => {
	test('submits the typed name with the selected family and cadence', async () => {
		const onSubmit = vi.fn();
		const screen = render(NouveauScreen, {
			props: { flowerStyle: 'aquarelle', onSubmit, onBack: vi.fn() }
		});

		await screen.getByPlaceholder('Nom de l’habitude').fill('Course du dimanche');
		await screen.getByRole('radio', { name: 'Objectif' }).click();

		const familyButtons = screen.container.querySelectorAll('.family-choice');
		(familyButtons[3] as HTMLButtonElement).click();

		await screen.getByRole('button', { name: 'Planter cette habitude' }).click();

		expect(onSubmit).toHaveBeenCalledWith({
			name: 'Course du dimanche',
			family: 'cosmos',
			cadence: 'objectif'
		});
	});

	test('shows the editing copy when isEditing is true', async () => {
		const screen = render(NouveauScreen, {
			props: { flowerStyle: 'aquarelle', isEditing: true, onSubmit: vi.fn(), onBack: vi.fn() }
		});

		await expect.element(screen.getByText('Adapter l’habitude')).toBeInTheDocument();
		await expect.element(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument();
	});
});
