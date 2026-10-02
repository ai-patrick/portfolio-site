import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Use vi.hoisted to set up mocks BEFORE imports
const { localStorageMock, setupDOM, IntersectionObserverMock } = vi.hoisted(() => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  const IntersectionObserverMock = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  const setupDOM = () => {
    document.body.innerHTML = `
      <nav id="navbar"></nav>
      <button id="chatTrigger" class="chat-widget" aria-label="Chat with Patrick">
        <svg></svg><span class="chat-label">Chat with Patrick</span>
      </button>
      <div id="chatModal" class="chat-modal" role="dialog" aria-modal="true" aria-label="Chat with Patrick">
        <div class="chat-modal-backdrop" id="chatBackdrop"></div>
        <div class="chat-modal-content">
          <header class="chat-header">
            <div class="chat-avatar">P</div>
            <div class="chat-title"><h3>Patrick Kilonzo</h3><span class="chat-status">Full-Stack Engineer</span></div>
            <button class="chat-close" id="chatClose">&times;</button>
          </header>
          <div class="chat-messages" id="chatMessages" role="log" aria-live="polite">
            <div class="message assistant">
              <div class="message-avatar">P</div>
              <div class="message-bubble">
                Hi! I'm Patrick's AI assistant. Ask me about his projects, skills, experience, or writing. What would you like to know?
              </div>
            </div>
          </div>
          <form class="chat-input-form" id="chatForm">
            <input type="text" id="chatInput" placeholder="Ask about Patrick..." maxlength="500" required />
            <button type="submit" id="chatSend"><svg></svg></button>
          </form>
        </div>
      </div>
    `;
  };
  
  return { localStorageMock, setupDOM, IntersectionObserverMock };
});

// Mock localStorage globally BEFORE import
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
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

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverMock });

// Setup DOM before import
setupDOM();

// Now import the script
import '../script.js';

describe('Chat Widget DOM Structure', () => {
  beforeEach(() => {
    setupDOM();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Modal Structure', () => {
    it('has chat trigger button', () => {
      const trigger = document.getElementById('chatTrigger');
      expect(trigger).toBeTruthy();
      expect(trigger?.classList.contains('chat-widget')).toBe(true);
      expect(trigger?.getAttribute('aria-label')).toBe('Chat with Patrick');
    });

    it('has modal with correct ARIA attributes', () => {
      const modal = document.getElementById('chatModal');
      expect(modal).toBeTruthy();
      expect(modal?.getAttribute('role')).toBe('dialog');
      expect(modal?.getAttribute('aria-modal')).toBe('true');
      expect(modal?.getAttribute('aria-label')).toBe('Chat with Patrick');
    });

    it('has modal backdrop', () => {
      const backdrop = document.getElementById('chatBackdrop');
      expect(backdrop).toBeTruthy();
      expect(backdrop?.classList.contains('chat-modal-backdrop')).toBe(true);
    });

    it('has modal content with header', () => {
      const content = document.querySelector('.chat-modal-content');
      expect(content).toBeTruthy();
      
      const header = content?.querySelector('.chat-header');
      expect(header).toBeTruthy();
      
      const avatar = header?.querySelector('.chat-avatar');
      expect(avatar).toBeTruthy();
      expect(avatar?.textContent).toBe('P');
      
      const title = header?.querySelector('.chat-title h3');
      expect(title?.textContent).toBe('Patrick Kilonzo');
      
      const closeBtn = header?.querySelector('.chat-close');
      expect(closeBtn).toBeTruthy();
      expect(closeBtn?.textContent).toBe('×');
    });

    it('has messages container with ARIA attributes', () => {
      const messages = document.getElementById('chatMessages');
      expect(messages).toBeTruthy();
      expect(messages?.getAttribute('role')).toBe('log');
      expect(messages?.getAttribute('aria-live')).toBe('polite');
      
      // Initial message should exist in DOM
      const initialMsg = messages?.querySelector('.message.assistant');
      expect(initialMsg).toBeTruthy();
      expect(initialMsg?.textContent).toContain("Patrick's AI assistant");
    });

    it('has input form with correct attributes', () => {
      const form = document.getElementById('chatForm');
      expect(form).toBeTruthy();
      
      const input = document.getElementById('chatInput');
      expect(input).toBeTruthy();
      expect(input?.getAttribute('placeholder')).toBe('Ask about Patrick...');
      expect(input?.getAttribute('maxlength')).toBe('500');
      expect(input?.hasAttribute('required')).toBe(true);
      
      const sendBtn = document.getElementById('chatSend');
      expect(sendBtn).toBeTruthy();
    });
  });

  describe('Input Validation', () => {
    it('limits message to 500 characters', () => {
      const input = document.getElementById('chatInput') as HTMLInputElement;
      input.value = 'x'.repeat(501);
      expect(input.validity.valid).toBe(false);
    });

    it('accepts 500 characters', () => {
      const input = document.getElementById('chatInput') as HTMLInputElement;
      input.value = 'x'.repeat(500);
      expect(input.validity.valid).toBe(true);
    });
  });

  describe('Chat Trigger Uniqueness', () => {
    it('has exactly one chat trigger button with correct ID', () => {
      const triggers = document.querySelectorAll('.chat-widget');
      expect(triggers.length).toBe(1);
      expect(triggers[0].id).toBe('chatTrigger');
      expect(triggers[0].textContent).toContain('Chat with Patrick');
    });
  });
});