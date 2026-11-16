import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export type ModelProvider = 'google' | 'openai' | 'deepseek' | 'xai' | 'anthropic';

// Current default model per provider. Older IDs stored in lib/data.ts or sent
// by the UI are mapped onto these, because providers retire old models
// (e.g. Gemini 1.5 is shut down and returns 404).
const DEFAULT_MODELS: Record<ModelProvider, string> = {
  google: 'gemini-flash-latest', // Google-maintained alias for the newest stable Flash
  openai: 'gpt-5-mini',
  deepseek: 'deepseek-chat',
  xai: 'grok-4.3',
  anthropic: 'claude-sonnet-5-5',
};

// Order used when the requested provider has no API key.
const FALLBACK_ORDER: ModelProvider[] = ['google', 'openai', 'anthropic', 'deepseek', 'xai'];

export class NoAIProviderError extends Error {
  constructor() {
    super(
      'No AI provider configured. Add at least one of GOOGLE_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY or XAI_API_KEY to the environment.'
    );
    this.name = 'NoAIProviderError';
  }
}

function apiKeyFor(provider: ModelProvider): string | undefined {
  switch (provider) {
    case 'google':
      return process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY;
    case 'xai':
      return process.env.XAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
  }
}

export function providerOf(modelId: string): ModelProvider {
  if (modelId.startsWith('gemini')) return 'google';
  if (modelId.startsWith('deepseek')) return 'deepseek';
  if (modelId.startsWith('grok')) return 'xai';
  if (modelId.startsWith('claude')) return 'anthropic';
  if (modelId.startsWith('gpt') || /^o\d/.test(modelId)) return 'openai';
  throw new Error(`Unknown or unsupported model: ${modelId}`);
}

/** Map retired or legacy model IDs onto current ones. */
export function normalizeModelId(modelId: string): string {
  const provider = providerOf(modelId);
  switch (provider) {
    case 'google':
      // gemini-1.x / 2.0 are shut down; route all legacy Gemini IDs to the alias.
      return /^gemini-(1\.|2\.0|2\.5-flash$)/.test(modelId) ? DEFAULT_MODELS.google : modelId;
    case 'xai':
      return modelId === 'grok-beta' || /^grok-[23]/.test(modelId) ? DEFAULT_MODELS.xai : modelId;
    case 'anthropic':
      return /^claude-3/.test(modelId) ? DEFAULT_MODELS.anthropic : modelId;
    case 'openai':
      return /^gpt-4o/.test(modelId) ? DEFAULT_MODELS.openai : modelId;
    default:
      return modelId;
  }
}

/** Providers that currently have an API key set. */
export function availableProviders(): ModelProvider[] {
  return FALLBACK_ORDER.filter((p) => !!apiKeyFor(p));
}

export function getModelInstance(requestedModelId: string) {
  let modelId = normalizeModelId(requestedModelId);
  let provider = providerOf(modelId);

  // Fallback: requested provider has no key -> use the first provider that does.
  if (!apiKeyFor(provider)) {
    const fallback = availableProviders()[0];
    if (!fallback) throw new NoAIProviderError();
    console.warn(
      `${provider} API key missing. Routing ${requestedModelId} to ${DEFAULT_MODELS[fallback]}`
    );
    provider = fallback;
    modelId = DEFAULT_MODELS[fallback];
  }

  const apiKey = apiKeyFor(provider)!;

  switch (provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(modelId);
    case 'openai':
      return createOpenAI({ apiKey })(modelId);
    case 'deepseek':
      // OpenAI-compatible API; use chat completions endpoint.
      return createOpenAI({ apiKey, baseURL: 'https://api.deepseek.com' }).chat(modelId);
    case 'xai':
      return createOpenAI({ apiKey, baseURL: 'https://api.x.ai/v1' }).chat(modelId);
    case 'anthropic':
      return createAnthropic({ apiKey })(modelId);
  }
}

/** Standard error response for API routes. */
export function aiErrorResponse(error: unknown, prefix: string) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  const status = error instanceof NoAIProviderError ? 503 : 500;
  console.error(`${prefix}:`, message);
  return new Response(JSON.stringify({ error: `${prefix}: ${message}` }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function streamWithModel(
  modelId: string,
  systemPrompt: string,
  userPrompt: string
) {
  const model = getModelInstance(modelId);
  return streamText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
  });
}
