import { describe, expect, test } from 'vitest';
import { createTolgeeInstance } from './tolgee';

describe('createTolgeeInstance', () => {
	test('resolves a key from the static data of the requested language', async () => {
		const tolgee = createTolgeeInstance('en');

		await tolgee.run();

		expect(tolgee.t('nav.garden')).toBe('Garden');
	});

	test('falls back to fr for a language without its own value', async () => {
		const tolgee = createTolgeeInstance('fr');

		await tolgee.run();

		expect(tolgee.t('nav.chat')).toBe('Écouter');
	});
});
