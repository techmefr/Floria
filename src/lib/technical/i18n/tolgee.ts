import { Tolgee, FormatSimple, type TolgeeInstance } from '@tolgee/web';
import fr from './locales/fr.json';
import en from './locales/en.json';
import { FALLBACK_LOCALE, type SupportedLocale } from './detectLocale';

export function createTolgeeInstance(language: SupportedLocale): TolgeeInstance {
	return Tolgee()
		.use(FormatSimple())
		.init({
			language,
			fallbackLanguage: FALLBACK_LOCALE,
			staticData: {
				fr: fr,
				en: en
			}
		});
}
