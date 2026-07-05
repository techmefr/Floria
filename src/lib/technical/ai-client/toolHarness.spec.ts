import { describe, expect, test } from 'vitest';
import { runToolCalls } from './toolHarness';

describe('runToolCalls', () => {
	test('dispatches each call to its registered handler and collects results', async () => {
		const results = await runToolCalls(
			[
				{ name: 'lister_habitudes', arguments: {} },
				{ name: 'proposer_habitude', arguments: { name: 'Méditation' } }
			],
			{
				lister_habitudes: () => ['Méditation'],
				proposer_habitude: (args) => ({ accepted: args.name })
			}
		);

		expect(results).toEqual([
			{ name: 'lister_habitudes', result: ['Méditation'] },
			{ name: 'proposer_habitude', result: { accepted: 'Méditation' } }
		]);
	});

	test('throws when no handler is registered for a call', async () => {
		await expect(runToolCalls([{ name: 'unknown_tool', arguments: {} }], {})).rejects.toThrow(
			'No handler registered for tool "unknown_tool"'
		);
	});
});
