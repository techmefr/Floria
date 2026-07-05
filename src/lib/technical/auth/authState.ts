import type { Session } from '@supabase/supabase-js';

export type AuthState = 'guest' | 'authenticated';

export function getAuthState(session: Session | null): AuthState {
	return session ? 'authenticated' : 'guest';
}
