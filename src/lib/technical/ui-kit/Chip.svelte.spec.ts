import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ChipTestHost from './__tests__/ChipTestHost.svelte';

describe('Chip', () => {
	test('shows its label and fires onclick when tapped', async () => {
		const onclick = vi.fn();
		const screen = render(ChipTestHost, { props: { onclick } });

		await expect.element(screen.getByText('Méditation')).toBeInTheDocument();
		await screen.getByRole('button').click();

		expect(onclick).toHaveBeenCalledOnce();
	});
});
