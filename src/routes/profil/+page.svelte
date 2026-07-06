<script lang="ts">
	import { get } from 'svelte/store';
	import { env } from '$env/dynamic/public';
	import { createSupabaseClient, getAuthState, type AuthState } from '$lib/technical/auth';
	import { ProfileScreen } from '$lib/functional/profile';
	import { getAppStores } from '../appStores';

	const stores = getAppStores();
	const preferences = stores.preferences.preferences;

	const supabase =
		env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_ANON_KEY
			? createSupabaseClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)
			: null;

	let authState = $state<AuthState>('guest');
	let userEmail = $state<string | undefined>(undefined);

	$effect(() => {
		if (!supabase) return;
		supabase.auth.getSession().then(({ data }) => {
			authState = getAuthState(data.session);
			userEmail = data.session?.user.email ?? undefined;
		});
	});

	function handleLogin(): void {
		if (!supabase) return;
		const email = window.prompt('Ton e-mail pour recevoir un lien de connexion :');
		if (email) void supabase.auth.signInWithOtp({ email });
	}

	function handleLoginWithGoogle(): void {
		if (!supabase) return;
		void supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `${window.location.origin}/profil` }
		});
	}

	function handleLogout(): void {
		if (!supabase) return;
		void supabase.auth.signOut().then(() => {
			authState = 'guest';
			userEmail = undefined;
		});
	}

	function handleExportData(): void {
		const payload = {
			habits: get(stores.habits.habits),
			logs: get(stores.habits.logs),
			suns: get(stores.session.suns),
			collected: get(stores.session.collected),
			preferences: get(stores.preferences.preferences)
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'floria-export.json';
		link.click();
		URL.revokeObjectURL(url);
	}

	async function handleReset(): Promise<void> {
		if (!window.confirm('Réinitialiser toutes tes données locales ?')) return;
		await stores.habits.resetAll();
		await stores.session.resetAll();
		await stores.preferences.resetAll();
	}
</script>

<ProfileScreen
	preferences={$preferences}
	{authState}
	{userEmail}
	onUpdate={(patch) => stores.preferences.update(patch)}
	onLogin={handleLogin}
	onLoginWithGoogle={handleLoginWithGoogle}
	onLogout={handleLogout}
	onExportData={handleExportData}
	onReset={handleReset}
/>
