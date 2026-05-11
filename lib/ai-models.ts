import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
// import { createAnthropic } from '@ai-sdk/anthropic'; // Install @ai-sdk/anthropic to use Claude
import { streamText } from 'ai';
import { AIModel } from './types';

export type ModelProvider = 'google' | 'openai' | 'deepseek' | 'anthropic';

export function getModelInstance(modelId: string) {
  // Google/Gemini
  if (modelId.startsWith('gemini')) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_API_KEY not configured');
    const google = createGoogleGenerativeAI({ apiKey });
    return google(modelId);
  }
  
  // DeepSeek (uses OpenAI-compatible API)
  if (modelId.startsWith('deepseek')) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('DEEPSEEK_API_KEY not configured');
    const deepseek = createOpenAI({ 
      apiKey, 
      baseURL: 'https://api.deepseek.com' 
    });
    return deepseek(modelId);
  }
  
  // OpenAI GPT
  if (modelId.startsWith('gpt')) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
    const openai = createOpenAI({ apiKey });
    return openai(modelId);
  }

  // Anthropic Claude (Requires @ai-sdk/anthropic)
  /*
  if (modelId.startsWith('claude')) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
    const anthropic = createAnthropic({ apiKey });
    return anthropic(modelId);
  }
  */
  
  throw new Error(`Unknown or unsupported model: ${modelId}`);
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
