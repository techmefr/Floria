export interface IAuthTokens {
	accessToken: string;
	refreshToken: string;
}

export function parseAuthTokensFromUrl(url: string, appScheme: string): IAuthTokens | null {
	if (!url.startsWith(appScheme)) {
		return null;
	}

	const hashIndex = url.indexOf('#');
	if (hashIndex === -1) {
		return null;
	}

	const params = new URLSearchParams(url.slice(hashIndex + 1));
	const accessToken = params.get('access_token');
	const refreshToken = params.get('refresh_token');

	if (!accessToken || !refreshToken) {
		return null;
	}

	return { accessToken, refreshToken };
}
