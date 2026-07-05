import { describe, expect, test } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import { getAuthState } from './authState';

describe('getAuthState', () => {
	test('is guest when there is no session', () => {
		expect(getAuthState(null)).toBe('guest');
	});

	test('is authenticated when a session is present', () => {
		expect(getAuthState({} as Session)).toBe('authenticated');
	});
});
