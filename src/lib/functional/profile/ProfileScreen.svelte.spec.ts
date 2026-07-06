import { describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ProfileScreen from './ProfileScreen.svelte';
import { DEFAULT_PREFERENCES } from './types';

describe('ProfileScreen', () => {
	test('shows both login options for a guest and reports taps', async () => {
		const onLogin = vi.fn();
		const onLoginWithGoogle = vi.fn();
		const screen = render(ProfileScreen, {
			props: {
				preferences: DEFAULT_PREFERENCES,
				authState: 'guest',
				onUpdate: vi.fn(),
				onLogin,
				onLoginWithGoogle,
				onLogout: vi.fn(),
				onExportData: vi.fn(),
				onReset: vi.fn()
			}
		});

		await screen.getByRole('button', { name: 'Recevoir un lien par e-mail' }).click();
		expect(onLogin).toHaveBeenCalled();

		await screen.getByRole('button', { name: 'Continuer avec Google' }).click();
		expect(onLoginWithGoogle).toHaveBeenCalled();
	});

	test('shows "Se déconnecter" and the email once authenticated', async () => {
		const screen = render(ProfileScreen, {
			props: {
				preferences: DEFAULT_PREFERENCES,
				authState: 'authenticated',
				userEmail: 'gaetan@example.com',
				onUpdate: vi.fn(),
				onLogin: vi.fn(),
				onLoginWithGoogle: vi.fn(),
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
				onLoginWithGoogle: vi.fn(),
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
				onLoginWithGoogle: vi.fn(),
				onLogout: vi.fn(),
				onExportData: vi.fn(),
				onReset: vi.fn()
			}
		});

		await screen.getByRole('radio', { name: 'Constellation' }).click();

		expect(onUpdate).toHaveBeenCalledWith({ gardenLayout: 'constellation' });
	});
});
