export type { ChatRole, IChatMessage, IToolDefinition, IToolCall, IChatResponse } from './types';
export { sendChatRequest, type ISendChatRequestParams } from './proxyClient';
export {
	runToolCalls,
	type ToolHandler,
	type ToolRegistry,
	type IToolCallResult
} from './toolHarness';
export {
	sendDirectChatRequest,
	AI_PROVIDERS,
	ACCOMPAGNEMENT_SYSTEM_PROMPT,
	type AiProvider,
	type IProviderOption
} from './directProviders';
