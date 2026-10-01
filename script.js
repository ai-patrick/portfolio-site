// ── SCROLL NAV ──
(function() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const THRESHOLD = 20;
  function update() {
    nav.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── THEME TOGGLE ──
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try { localStorage.setItem('theme', newTheme); } catch {}
}

(function() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch {}
})();

// ── SCROLL ANIMATIONS ──
(function() {
  try {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
      section.style.animation = 'none';
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(section);
    });

    const style = document.createElement('style');
    style.textContent = `
      section.in-view { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);
  } catch {}
})();

// ── CHAT WIDGET ──
class ChatWidget {
  constructor() {
    this.trigger = document.getElementById('chatTrigger');
    this.modal = document.getElementById('chatModal');
    this.backdrop = document.getElementById('chatBackdrop');
    this.closeBtn = document.getElementById('chatClose');
    this.form = document.getElementById('chatForm');
    this.input = document.getElementById('chatInput');
    this.messagesContainer = document.getElementById('chatMessages');
    this.sendBtn = document.getElementById('chatSend');
    
    this.messages = [];
    this.isStreaming = false;
    this.abortController = null;
    this.endpoint = 'https://portfolio-site-patrick-chat-api.vercel.app/api/chat';
    
    this.init();
  }

  init() {
    this.trigger?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.backdrop?.addEventListener('click', () => this.close());
    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('open')) this.close();
    });
  }

  open() {
    this.modal?.classList.add('open');
    this.trigger?.setAttribute('aria-expanded', 'true');
    this.input?.focus();
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal?.classList.remove('open');
    this.trigger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (this.isStreaming) this.cancelStream();
  }

  handleSubmit(e) {
    e.preventDefault();
    const text = this.input.value.trim();
    if (!text || this.isStreaming) return;
    
    this.addMessage('user', text);
    this.input.value = '';
    this.sendToAPI(text);
  }

  addMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `
      <div class="message-avatar">${role === 'assistant' ? 'P' : '👤'}</div>
      <div class="message-bubble">${this.escapeHtml(content)}</div>
    `;
    this.messagesContainer.appendChild(div);
    this.scrollToBottom();
    return div.querySelector('.message-bubble');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  async sendToAPI(userMessage) {
    this.isStreaming = true;
    this.sendBtn.disabled = true;
    this.input.disabled = true;
    
    const bubble = this.addMessage('assistant', '');
    let fullContent = '';
    
    this.messages.push({ role: 'user', content: userMessage });
    
    this.abortController = new AbortController();
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: this.messages.slice(-10), // Keep last 10 for context
          stream: true 
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                bubble.textContent = fullContent;
                this.scrollToBottom();
              }
            } catch {}
          }
        }
      }
      
      this.messages.push({ role: 'assistant', content: fullContent });
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Chat error:', err);
        bubble.textContent = 'Sorry, something went wrong. Please try again.';
      }
    } finally {
      this.isStreaming = false;
      this.sendBtn.disabled = false;
      this.input.disabled = false;
      this.input.focus();
    }
  }

  cancelStream() {
    this.abortController?.abort();
    this.isStreaming = false;
    this.sendBtn.disabled = false;
    this.input.disabled = false;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new ChatWidget());

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChatWidget };
}