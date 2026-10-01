import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock env before importing
vi.stubEnv('NVIDIA_API_KEY', 'nvapi-test-key-12345');
vi.stubEnv('NVIDIA_BASE_URL', 'https://integrate.api.nvidia.com/v1');
vi.stubEnv('NVIDIA_DEFAULT_MODEL', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_CLASSIFY', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_REPORT', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_PLAYBOOK', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_COMPLIANCE', 'openai/gpt-oss-20b');

// Mock OpenAI
const mockCreate = vi.fn();
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  })),
}));

import handler from '../../api/chat.js';

function createMockReq(body: object) {
  return { method: 'POST', body, headers: {} } as any;
}
function createMockRes() {
  const res: any = { 
    statusCode: 200, 
    headers: {}, 
    body: '', 
    status(c) { this.statusCode=c; return this; }, 
    setHeader(k,v) { this.headers[k]=v; return this; }, 
    json(d) { this.body = d; return this; },
    write(d) { this.body+=d; return this; }, 
    end() {}, 
    flushHeaders() {}, 
    writableEnded: false 
  };
  return res;
}

describe('SSE Streaming', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockCreate.mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: 'Hello' } }] };
        yield { choices: [{ delta: { content: ' world' } }] };
        yield { choices: [{ delta: {} }] };
      },
    });
  });

  it('streams tokens as SSE data events', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'Hello' }], stream: true });
    const res = createMockRes();
    await handler(req, res);
    
    // Parse SSE events
    const events = res.body
      .split('\n\n')
      .filter(l => l.startsWith('data: '))
      .map(l => l.slice(6))
      .filter(l => l !== '[DONE]');
    
    expect(events.length).toBeGreaterThan(0);
    events.forEach(event => {
      const parsed = JSON.parse(event);
      expect(parsed).toHaveProperty('content');
      expect(typeof parsed.content).toBe('string');
    });
  });

  it('ends with [DONE] marker', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'Hi' }], stream: true });
    const res = createMockRes();
    await handler(req, res);
    expect(res.body).toContain('data: [DONE]');
  });

  it('sets correct streaming headers', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'Hi' }], stream: true });
    const res = createMockRes();
    await handler(req, res);
    expect(res.headers['Content-Type']).toBe('text/event-stream');
    expect(res.headers['Cache-Control']).toBe('no-cache');
    expect(res.headers['Connection']).toBe('keep-alive');
  });
});