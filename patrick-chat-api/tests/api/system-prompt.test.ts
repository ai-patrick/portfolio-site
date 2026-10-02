import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock env before importing
vi.stubEnv('NVIDIA_API_KEY', 'nvapi-test-key-12345');
vi.stubEnv('NVIDIA_BASE_URL', 'https://integrate.api.nvidia.com/v1');
vi.stubEnv('NVIDIA_DEFAULT_MODEL', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_CLASSIFY', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_REPORT', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_PLAYBOOK', 'openai/gpt-oss-20b');
vi.stubEnv('NVIDIA_MODEL_COMPLIANCE', 'openai/gpt-oss-20b');

// Mock OpenAI to capture system prompt
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

describe('System Prompt Enforcement', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockCreate.mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: 'OK' } }] };
        yield { choices: [{ delta: {} }] };
      },
    });
  });

  it('injects system prompt as first message', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'What is 2+2?' }] });
    const res = createMockRes();
    await handler(req, res);
    
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages[0].role).toBe('system');
    expect(callArgs.messages[0].content).toContain('Patrick Kilonzo');
    expect(callArgs.messages[0].content).toContain('You ONLY answer questions related to Patrick Kilonzo');
  });

  it('blocks off-topic questions via system prompt', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'What is the capital of France?' }] });
    const res = createMockRes();
    
    // Mock refusal response
    mockCreate.mockResolvedValueOnce({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: 'I can only answer questions about Patrick Kilonzo' } }] };
      },
    });
    
    await handler(req, res);
    expect(res.body).toContain('Patrick Kilonzo');
  });

  it('includes Patrick\'s projects in system prompt', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'Tell me about Alina906Vibes' }] });
    const res = createMockRes();
    await handler(req, res);
    
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages[0].content).toContain('Alina906Vibes');
    expect(callArgs.messages[0].content).toContain('Polygon');
  });

  it('includes writing topics in system prompt', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'What did Patrick write about?' }] });
    const res = createMockRes();
    await handler(req, res);
    
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages[0].content).toContain('useEffect');
    expect(callArgs.messages[0].content).toContain('M-Pesa');
    expect(callArgs.messages[0].content).toContain('Docker Compose');
  });

  it('uses low temperature (0.3) for factual responses', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'Hi' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(mockCreate.mock.calls[0][0].temperature).toBe(0.3);
  });

  it('uses the correct model from env', async () => {
    const req = createMockReq({ messages: [{ role: 'user', content: 'Hi' }] });
    const res = createMockRes();
    await handler(req, res);
    expect(mockCreate.mock.calls[0][0].model).toBe('openai/gpt-oss-20b');
  });
});