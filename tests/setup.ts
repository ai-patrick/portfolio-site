import { vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock DOM APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});

// Reset DOM before each test
beforeEach(() => {
  document.body.innerHTML = `
    <nav id="navbar"></nav>
  `;
  vi.clearAllMocks();
});