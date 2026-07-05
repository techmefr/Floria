import { App } from '@capacitor/app';
import type { SupabaseClient } from '@supabase/supabase-js';
import { parseAuthTokensFromUrl } from './deepLink';

export function registerAuthDeepLink(supabase: SupabaseClient, appScheme: string): () => void {
	const listenerPromise = App.addListener('appUrlOpen', ({ url }) => {
		const tokens = parseAuthTokensFromUrl(url, appScheme);
		if (!tokens) {
			return;
		}

		void supabase.auth.setSession({
			access_token: tokens.accessToken,
			refresh_token: tokens.refreshToken
		});
	});

	return () => {
		void listenerPromise.then((listener) => listener.remove());
	};
}
