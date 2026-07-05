import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ButtonTestHost from './__tests__/ButtonTestHost.svelte';

describe('Button', () => {
	test('fires onclick when enabled', async () => {
		const onclick = vi.fn();
		const screen = render(ButtonTestHost, { props: { onclick } });

		await screen.getByRole('button').click();

		expect(onclick).toHaveBeenCalledOnce();
	});

	test('does not fire onclick when disabled', async () => {
		const onclick = vi.fn();
		const screen = render(ButtonTestHost, { props: { onclick, isDisabled: true } });

		await expect.element(screen.getByRole('button')).toBeDisabled();
	});
});
