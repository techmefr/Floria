export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const FALLBACK_LOCALE: SupportedLocale = 'fr';

export function detectDeviceLocale(navigatorLanguages: readonly string[]): SupportedLocale {
	for (const language of navigatorLanguages) {
		const base = language.split('-')[0];
		if ((SUPPORTED_LOCALES as readonly string[]).includes(base)) {
			return base as SupportedLocale;
		}
	}
	return FALLBACK_LOCALE;
}
