import { describe, expect, test } from 'vitest';
import { parseAuthTokensFromUrl } from './deepLink';

const SCHEME = 'com.floria.app://auth-callback';

describe('parseAuthTokensFromUrl', () => {
	test('extracts access and refresh tokens from the URL fragment', () => {
		const url = `${SCHEME}#access_token=abc&refresh_token=def&expires_in=3600`;

		expect(parseAuthTokensFromUrl(url, SCHEME)).toEqual({
			accessToken: 'abc',
			refreshToken: 'def'
		});
	});

	test('returns null for a URL outside the app scheme', () => {
		const url = 'https://example.com#access_token=abc&refresh_token=def';

		expect(parseAuthTokensFromUrl(url, SCHEME)).toBeNull();
	});

	test('returns null when there is no fragment', () => {
		expect(parseAuthTokensFromUrl(SCHEME, SCHEME)).toBeNull();
	});

	test('returns null when a token is missing', () => {
		const url = `${SCHEME}#access_token=abc`;

		expect(parseAuthTokensFromUrl(url, SCHEME)).toBeNull();
	});
});
