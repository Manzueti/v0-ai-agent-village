import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
// import { createAnthropic } from '@ai-sdk/anthropic'; // Install @ai-sdk/anthropic to use Claude
import { streamText } from 'ai';
import { AIModel } from './types';

export type ModelProvider = 'google' | 'openai' | 'deepseek' | 'anthropic';

export function getModelInstance(modelId: string) {
  const hasGoogle = !!process.env.GOOGLE_API_KEY;
  const hasDeepseek = !!process.env.DEEPSEEK_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  let finalModelId = modelId;

  // Fallback Logic: If requested key is missing, reroute to an available provider
  if (modelId.startsWith('deepseek') && !hasDeepseek) {
    console.warn(`DEEPSEEK_API_KEY missing. Routing to fallback for ${modelId}`);
    if (hasGoogle) finalModelId = 'gemini-1.5-flash';
    else if (hasOpenAI) finalModelId = 'gpt-4o-mini';
  }

  if (modelId.startsWith('gpt') && !hasOpenAI) {
    console.warn(`OPENAI_API_KEY missing. Routing to fallback for ${modelId}`);
    if (hasGoogle) finalModelId = 'gemini-1.5-flash';
    else if (hasDeepseek) finalModelId = 'deepseek-chat';
  }

  if (modelId.startsWith('gemini') && !hasGoogle) {
    console.warn(`GOOGLE_API_KEY missing. Routing to fallback for ${modelId}`);
    if (hasOpenAI) finalModelId = 'gpt-4o-mini';
    else if (hasDeepseek) finalModelId = 'deepseek-chat';
  }

  // Google/Gemini
  if (finalModelId.startsWith('gemini')) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('CRITICAL: No API keys configured. Please add GOOGLE_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY to your environment variables.');
    const google = createGoogleGenerativeAI({ apiKey });
    return google(finalModelId);
  }
  
  // DeepSeek (uses OpenAI-compatible API)
  if (finalModelId.startsWith('deepseek')) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('CRITICAL: No API keys configured.');
    const deepseek = createOpenAI({ 
      apiKey, 
      baseURL: 'https://api.deepseek.com' 
    });
    return deepseek(finalModelId);
  }
  
  // OpenAI GPT
  if (finalModelId.startsWith('gpt')) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('CRITICAL: No API keys configured.');
    const openai = createOpenAI({ apiKey });
    return openai(finalModelId);
  }

  // Anthropic Claude (Requires @ai-sdk/anthropic)
  /*
  if (finalModelId.startsWith('claude')) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
    const anthropic = createAnthropic({ apiKey });
    return anthropic(finalModelId);
  }
  */
  
  throw new Error(`Unknown or unsupported model: ${finalModelId}`);
}

export async function streamWithModel(
  modelId: string,
  systemPrompt: string,
  userPrompt: string
) {
  const model = getModelInstance(modelId);
  return streamText({ 
    model: model as any, 
    system: systemPrompt, 
    prompt: userPrompt 
  });
}
