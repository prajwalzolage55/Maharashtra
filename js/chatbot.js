/**
 * Maharashtra: Unity in Diversity 2026
 * Rule-Based Keyword FAQ Assistant (Maharashtra Bot)
 * Department of Artificial Intelligence & Data Science
 */

class MaharashtraChatbot {
  constructor() {
    this.faqData = [];
    this.panel = document.getElementById('chatbotPanel');
    this.fab = document.getElementById('chatbotFab');
    this.closeBtn = document.getElementById('chatbotClose');
    this.messagesContainer = document.getElementById('chatbotMessages');
    this.input = document.getElementById('chatbotInput');
    this.sendBtn = document.getElementById('chatbotSend');
    this.chipsContainer = document.getElementById('suggestionChips');

    this.isOpen = false;
    this.init();
  }

  async init() {
    try {
      const res = await fetch('data/faq.json');
      this.faqData = await res.json();
    } catch (e) {
      console.warn('FAQ data fetch error:', e);
      this.faqData = [
        {
          keywords: ["capital"],
          question: "What is the capital?",
          answer: "Mumbai is the capital and Nagpur is the winter capital."
        }
      ];
    }

    if (this.fab) {
      this.fab.addEventListener('click', () => this.toggleChat());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.toggleChat(false));
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleUserSend());
    }

    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleUserSend();
      });
    }

    if (this.chipsContainer) {
      this.chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (chip) {
          const query = chip.getAttribute('data-query') || chip.textContent;
          this.processQuery(query);
        }
      });
    }
  }

  toggleChat(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.panel) {
      if (this.isOpen) {
        this.panel.classList.add('open');
        if (this.input) this.input.focus();
      } else {
        this.panel.classList.remove('open');
      }
    }
  }

  handleUserSend() {
    if (!this.input) return;
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.processQuery(text);
  }

  processQuery(userText) {
    this.appendMessage(userText, 'user');
    const typingEl = this.showTyping();

    setTimeout(() => {
      if (typingEl) typingEl.remove();
      const answer = this.findAnswer(userText);
      this.appendMessage(answer, 'bot');
    }, 450);
  }

  appendMessage(text, sender) {
    if (!this.messagesContainer) return;
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.textContent = text;
    this.messagesContainer.appendChild(msg);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return msg;
  }

  showTyping() {
    if (!this.messagesContainer) return null;
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    this.messagesContainer.appendChild(typing);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return typing;
  }

  findAnswer(userQuery) {
    const qLower = userQuery.toLowerCase().trim();
    const tokens = qLower.split(/[\s,?.!]+/).filter(w => w.length > 2);

    let bestMatch = null;
    let highestScore = 0;

    for (const item of this.faqData) {
      let score = 0;

      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();
        if (qLower.includes(kwLower)) {
          score += 5;
        }

        for (const token of tokens) {
          if (kwLower.includes(token)) {
            score += 2;
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore >= 2) {
      return bestMatch.answer;
    }

    const isMarathi = document.documentElement.lang === 'mr';
    return isMarathi
      ? "माफ करा, याबद्दल मला पुरेशी माहिती नाही. आपण महाराष्ट्राचा इतिहास, खाद्यपदार्थ, गडकोट किंवा आजच्या स्टॉलबद्दल विचारू शकता."
      : "I'm not completely certain about that. Try asking about Maharashtra's capital, forts, reformers, food, festivals, or our department stall.";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chatbotApp = new MaharashtraChatbot();
});
