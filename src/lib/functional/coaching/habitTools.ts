import type { IToolDefinition, ToolRegistry } from '$lib/technical/ai-client';
import type { IHabit } from '$lib/functional/habits';

export const HABIT_TOOL_DEFINITIONS: IToolDefinition[] = [
	{
		name: 'lister_habitudes',
		description: "Renvoie les habitudes actives de l'utilisateur, pour contexte.",
		parameters: { type: 'object', properties: {}, required: [] }
	},
	{
		name: 'proposer_habitude',
		description: 'Propose une nouvelle habitude sous forme de carte, sans jamais la créer seul.',
		parameters: {
			type: 'object',
			properties: {
				name: { type: 'string' },
				family: { type: 'string' },
				cadence: { type: 'string', enum: ['quotidien', 'quelques-fois', 'objectif'] }
			},
			required: ['name']
		}
	},
	{
		name: 'adapter_habitude',
		description: "Propose un ajustement d'une habitude existante (adapter, jamais supprimer).",
		parameters: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				patch: { type: 'object' }
			},
			required: ['id', 'patch']
		}
	}
];

export interface IHabitToolsDeps {
	listHabits: () => IHabit[];
	getHabit: (id: string) => IHabit | undefined;
	buildSuggestion: (partial: Partial<IHabit>) => IHabit;
}

export function createHabitTools(deps: IHabitToolsDeps): ToolRegistry {
	return {
		lister_habitudes: () =>
			deps
				.listHabits()
				.filter((habit) => !habit.isArchived)
				.map((habit) => ({ id: habit.id, name: habit.name, cadence: habit.cadence })),

		proposer_habitude: (args) => deps.buildSuggestion(args as Partial<IHabit>),

		adapter_habitude: (args) => {
			const { id, patch } = args as { id: string; patch: Partial<IHabit> };
			const existing = deps.getHabit(id);
			if (!existing) {
				throw new Error(`Habit "${id}" not found`);
			}
			return deps.buildSuggestion({ ...existing, ...patch, id: existing.id });
		}
	};
}
