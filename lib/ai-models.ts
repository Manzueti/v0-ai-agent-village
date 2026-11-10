import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type LanguageModel } from 'ai';
import {
  AI_PROVIDER_ENV_NAMES,
  MISSING_API_KEY_CODE,
  MISSING_API_KEY_MESSAGE,
  type AiProviderEnv,
} from './ai-key-copy';

const PLACEHOLDER_KEY = /^your_.+_here$/i;

const MODEL_ALIASES: Record<string, string> = {
  'gemini-2.5-flash': 'gemini-1.5-flash',
};

type ProviderId = 'google' | 'deepseek' | 'openai' | 'xai' | 'anthropic';

const PROVIDER_ENV: Record<ProviderId, AiProviderEnv> = {
  google: 'GOOGLE_API_KEY',
  deepseek: 'DEEPSEEK_API_KEY',
  openai: 'OPENAI_API_KEY',
  xai: 'XAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
};

const FALLBACKS: { provider: ProviderId; modelId: string }[] = [
  { provider: 'google', modelId: 'gemini-1.5-flash' },
  { provider: 'openai', modelId: 'gpt-4o-mini' },
  { provider: 'deepseek', modelId: 'deepseek-chat' },
  { provider: 'xai', modelId: 'grok-beta' },
  { provider: 'anthropic', modelId: 'claude-3-5-sonnet' },
];

export type ResolvedModel =
  | { ok: true; model: LanguageModel; modelId: string }
  | { ok: false; code: typeof MISSING_API_KEY_CODE | 'unsupported_model'; message: string };

function readEnvKey(name: string): string | null {
  const value = process.env[name];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER_KEY.test(trimmed)) return null;
  return trimmed;
}

export function readProviderKey(name: AiProviderEnv): string | null {
  if (name === 'GOOGLE_API_KEY') {
    return readEnvKey('GOOGLE_API_KEY') ?? readEnvKey('GOOGLE_GENERATIVE_AI_API_KEY');
  }
  return readEnvKey(name);
}

export function configuredProviders(): AiProviderEnv[] {
  return AI_PROVIDER_ENV_NAMES.filter((name) => readProviderKey(name) !== null);
}

export function aiStatusPayload() {
  const configured = configuredProviders();
  const ready = configured.length > 0;
  return {
    ready,
    configured,
    missing: AI_PROVIDER_ENV_NAMES.filter((name) => !configured.includes(name)),
    code: ready ? null : MISSING_API_KEY_CODE,
    message: ready ? null : MISSING_API_KEY_MESSAGE,
  };
}

function providerForModel(modelId: string): ProviderId | null {
  if (modelId.startsWith('gemini')) return 'google';
  if (modelId.startsWith('deepseek')) return 'deepseek';
  if (modelId.startsWith('gpt')) return 'openai';
  if (modelId.startsWith('grok')) return 'xai';
  if (modelId.startsWith('claude')) return 'anthropic';
  return null;
}

function instantiate(provider: ProviderId, modelId: string, apiKey: string): LanguageModel {
  if (provider === 'google') return createGoogleGenerativeAI({ apiKey })(modelId);
  if (provider === 'deepseek') {
    return createOpenAI({ apiKey, baseURL: 'https://api.deepseek.com' })(modelId);
  }
  if (provider === 'openai') return createOpenAI({ apiKey })(modelId);
  if (provider === 'xai') {
    return createOpenAI({ apiKey, baseURL: 'https://api.x.ai/v1' })(modelId);
  }
  return createAnthropic({ apiKey })(modelId);
}

/** Resolve a model without throwing. Missing keys return a structured failure. */
export function resolveModel(requestedModelId: string): ResolvedModel {
  const configured = new Set(configuredProviders());
  if (configured.size === 0) {
    return { ok: false, code: MISSING_API_KEY_CODE, message: MISSING_API_KEY_MESSAGE };
  }

  let modelId = MODEL_ALIASES[requestedModelId] ?? requestedModelId;
  const requestedProvider = providerForModel(modelId);
  if (!requestedProvider) {
    return {
      ok: false,
      code: 'unsupported_model',
      message: `Unsupported model: ${requestedModelId}`,
    };
  }

  if (!configured.has(PROVIDER_ENV[requestedProvider])) {
    const fallback = FALLBACKS.find((entry) => configured.has(PROVIDER_ENV[entry.provider]));
    if (!fallback) {
      return { ok: false, code: MISSING_API_KEY_CODE, message: MISSING_API_KEY_MESSAGE };
    }
    modelId = fallback.modelId;
  }

  const provider = providerForModel(modelId);
  if (!provider) {
    return {
      ok: false,
      code: 'unsupported_model',
      message: `Unsupported model: ${modelId}`,
    };
  }

  const apiKey = readProviderKey(PROVIDER_ENV[provider]);
  if (!apiKey) {
    return { ok: false, code: MISSING_API_KEY_CODE, message: MISSING_API_KEY_MESSAGE };
  }

  return { ok: true, model: instantiate(provider, modelId, apiKey), modelId };
}

export function modelFailureResponse(failure: Extract<ResolvedModel, { ok: false }>): Response {
  return Response.json(
    { error: failure.code, code: failure.code, message: failure.message },
    { status: failure.code === MISSING_API_KEY_CODE ? 503 : 400 },
  );
}

export async function streamWithModel(
  modelId: string,
  systemPrompt: string,
  userPrompt: string,
) {
  const resolved = resolveModel(modelId);
  if (!resolved.ok) return modelFailureResponse(resolved);
  return streamText({
    model: resolved.model,
    system: systemPrompt,
    prompt: userPrompt,
  });
}
