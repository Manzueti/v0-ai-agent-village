import { MISSING_API_KEY_CODE, MISSING_API_KEY_MESSAGE } from './ai-key-copy';

export class AiRequestError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'AiRequestError';
    this.code = code;
  }
}

type AiErrorBody = {
  code?: string;
  error?: string;
  message?: string;
};

export async function readAiFailure(response: Response): Promise<{ code: string; message: string }> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const data = (await response.json().catch(() => null)) as AiErrorBody | null;
    const code =
      data?.code ||
      (data?.error === MISSING_API_KEY_CODE ? MISSING_API_KEY_CODE : undefined) ||
      'request_failed';
    const message =
      data?.message ||
      (code === MISSING_API_KEY_CODE ? MISSING_API_KEY_MESSAGE : data?.error) ||
      MISSING_API_KEY_MESSAGE;
    return { code, message };
  }

  const text = await response.text().catch(() => '');
  if (text.includes(MISSING_API_KEY_CODE) || /api[_ ]key/i.test(text)) {
    return { code: MISSING_API_KEY_CODE, message: MISSING_API_KEY_MESSAGE };
  }
  return { code: 'request_failed', message: text || 'The AI request failed.' };
}

export async function aiFailureFromResponse(response: Response): Promise<AiRequestError> {
  const failure = await readAiFailure(response);
  return new AiRequestError(failure.message, failure.code);
}
