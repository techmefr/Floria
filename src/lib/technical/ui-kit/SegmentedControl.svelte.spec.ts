import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SegmentedControlTestHost from './__tests__/SegmentedControlTestHost.svelte';

describe('SegmentedControl', () => {
	test('selecting an option marks it checked and calls onchange', async () => {
		const onchange = vi.fn();
		const screen = render(SegmentedControlTestHost, {
			props: { value: 'quotidien', onchange }
		});

		await screen.getByRole('radio', { name: 'Objectif' }).click();

		expect(onchange).toHaveBeenCalledWith('objectif');
		await expect
			.element(screen.getByRole('radio', { name: 'Objectif' }))
			.toHaveAttribute('aria-checked', 'true');
		await expect
			.element(screen.getByRole('radio', { name: 'Quotidien' }))
			.toHaveAttribute('aria-checked', 'false');
	});
});
