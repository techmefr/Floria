import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ProfileScreen from './ProfileScreen.svelte';
import { DEFAULT_PREFERENCES } from './types';

describe('ProfileScreen', () => {
	test('shows "Se connecter" for a guest and reports login taps', async () => {
		const onLogin = vi.fn();
		const screen = render(ProfileScreen, {
			props: {
				preferences: DEFAULT_PREFERENCES,
				authState: 'guest',
				onUpdate: vi.fn(),
				onLogin,
				onLogout: vi.fn(),
				onExportData: vi.fn(),
				onReset: vi.fn()
			}
		});

		await screen.getByRole('button', { name: 'Se connecter' }).click();
		expect(onLogin).toHaveBeenCalled();
	});

	test('shows "Se déconnecter" and the email once authenticated', async () => {
		const screen = render(ProfileScreen, {
			props: {
				preferences: DEFAULT_PREFERENCES,
				authState: 'authenticated',
				userEmail: 'gaetan@example.com',
				onUpdate: vi.fn(),
				onLogin: vi.fn(),
				onLogout: vi.fn(),
				onExportData: vi.fn(),
				onReset: vi.fn()
			}
		});

		await expect.element(screen.getByText('gaetan@example.com')).toBeInTheDocument();
		await expect
			.element(screen.getByRole('button', { name: 'Se déconnecter' }))
			.toBeInTheDocument();
	});

	test('toggling high contrast reports the new value', async () => {
		const onUpdate = vi.fn();
		const screen = render(ProfileScreen, {
			props: {
				preferences: DEFAULT_PREFERENCES,
				authState: 'guest',
				onUpdate,
				onLogin: vi.fn(),
				onLogout: vi.fn(),
				onExportData: vi.fn(),
				onReset: vi.fn()
			}
		});

		const checkboxes = screen.container.querySelectorAll('input[type="checkbox"]');
		(checkboxes[0] as HTMLInputElement).click();

		expect(onUpdate).toHaveBeenCalledWith({ highContrast: true });
	});

	test('choosing a garden layout reports the new value', async () => {
		const onUpdate = vi.fn();
		const screen = render(ProfileScreen, {
			props: {
				preferences: DEFAULT_PREFERENCES,
				authState: 'guest',
				onUpdate,
				onLogin: vi.fn(),
				onLogout: vi.fn(),
				onExportData: vi.fn(),
				onReset: vi.fn()
			}
		});

		await screen.getByRole('radio', { name: 'Constellation' }).click();

		expect(onUpdate).toHaveBeenCalledWith({ gardenLayout: 'constellation' });
	});
});
