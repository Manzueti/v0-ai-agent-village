/** Shared copy for missing model-provider keys. Safe to import from client code. */

export const AI_PROVIDER_ENV_NAMES = [
  'GOOGLE_API_KEY',
  'DEEPSEEK_API_KEY',
  'OPENAI_API_KEY',
  'XAI_API_KEY',
  'ANTHROPIC_API_KEY',
] as const;

export type AiProviderEnv = (typeof AI_PROVIDER_ENV_NAMES)[number];

export const MISSING_API_KEY_CODE = 'missing_api_key';

export const MISSING_API_KEY_MESSAGE =
  'Add your API key. Set GOOGLE_API_KEY, DEEPSEEK_API_KEY, OPENAI_API_KEY, XAI_API_KEY, or ANTHROPIC_API_KEY (see .env.example), then restart the server.';
