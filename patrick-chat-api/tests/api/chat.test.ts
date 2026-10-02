import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock env before importing the handler
vi.stubEnv('NVIDIA_API_KEY', 'nvapi-test-key-12345');
vi.stubEnv('NVIDIA_BASE_URL', 'https://integrate.api.nvidia.com/v1');
vi.stubEnv('NVIDIA_DEFAULT_MODEL', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_CLASSIFY', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_REPORT', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_PLAYBOOK', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_COMPLIANCE', 'openai/gpt-oss-20b');

// Mock OpenAI before import
const mockCreate = vi.fn();
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  })),
}));

import handler from '../../api/chat.js';

// Mock Request/Response for Vercel
function createMockReq(body: object, method = 'POST') {
  return {
    method,
    body,
    headers: { 'content-type': 'application/json' },
  } as any;
}

function createMockRes() {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) { this.statusCode = code; return this; },
    setHeader(key: string, value: string) { this.headers[key] = value; return this; },
    json(data: object) { this.body = data; return this; },
    end(data?: string) { this.body = data ?? this.body; return this; },
    write(data: string) { this.body = (this.body || '') + data; return this; },
    flushHeaders() {},
    writableEnded: false,
  };
  return res;
}

describe('Chat API Handler', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = createMockReq({ messages: [{ role: 'user', content: 'Hi' }] });
    res = createMockRes();
    mockCreate.mockReset();
    
    // Default successful streaming response
    mockCreate.mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: 'Hello' } }] };
        yield { choices: [{ delta: { content: ' world' } }] };
        yield { choices: [{ delta: {} }] };
      },
    });
  });

  it('returns 405 for non-POST methods', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: 'Method not allowed' });
  });

  it('handles OPTIONS (CORS preflight)', async () => {
    req.method = 'OPTIONS';
    await handler(req, res);
    expect(res.statusCode).toBe(204);
  });

  it('rejects empty messages array', async () => {
    req.body = { messages: [] };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid request');
  });

  it('rejects messages over 2000 chars', async () => {
    req.body = { messages: [{ role: 'user', content: 'x'.repeat(2001) }] };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('rejects more than 20 messages', async () => {
    req.body = { messages: Array(21).fill({ role: 'user', content: 'hi' }) };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('validates role enum', async () => {
    req.body = { messages: [{ role: 'system', content: 'hi' }] };
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('sets CORS headers', async () => {
    await handler(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(res.headers['Access-Control-Allow-Methods']).toContain('POST');
  });

  it('returns streaming response by default', async () => {
    await handler(req, res);
    expect(res.headers['Content-Type']).toBe('text/event-stream');
    expect(res.body).toContain('data: ');
    expect(res.body).toContain('[DONE]');
  });

  it('uses the correct default model from env', async () => {
    await handler(req, res);
    const usedModel = mockCreate.mock.calls[0][0].model;
    expect(usedModel).toBe('openai/gpt-oss-20b');
  });
});