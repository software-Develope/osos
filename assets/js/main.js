document.addEventListener('DOMContentLoaded', () => {
    // Bottom Navigation Logic
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                // Scrolling down & past header
                bottomNav.classList.add('hidden');
            } else {
                // Scrolling up
                bottomNav.classList.remove('hidden');
            }
            lastScrollY = window.scrollY;
        });
    }

    // Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    // Increment speed (higher divisor = slower)
                    const inc = target / 50;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Animate only once
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5 
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Cards Entrance Animation
    const cards = document.querySelectorAll('.card');
    
    const animateCards = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(cards).indexOf(card);
                
                setTimeout(() => {
                    card.classList.remove('hidden-card');
                }, index * 400); // 400ms stagger delay
                
                observer.unobserve(card);
            }
        });
    };
    
    const cardObserver = new IntersectionObserver(animateCards, {
        threshold: 0.2
    });
    
    cards.forEach(card => {
        card.classList.add('hidden-card');
        cardObserver.observe(card);
    });
});

// --- Custom Chatbot Injection & Logic ---
document.addEventListener("DOMContentLoaded", function() {
  const chatbotHTML = `
    <div id="custom-chatbot" class="custom-chatbot" dir="rtl">
      <div class="chatbot-window hidden" id="chatbotWindow">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <img src="assets/logo.png" alt="شعار أسس" class="chatbot-logo" onerror="this.src='../assets/logo.png'">
            <div class="chatbot-title">
              <strong>أسس ديف</strong>
              <span>Customer Support</span>
            </div>
          </div>
          <button class="chatbot-close" id="chatbotClose" aria-label="إغلاق">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="chatbot-body" id="chatbotBody">
          <div class="chat-message bot-message">
            أهلاً! عندك فكرة؟ خلّينا نبنيها سوا 🚀
          </div>
        </div>
        <div class="chatbot-input-area">
          <div class="chatbot-options-scroll" id="chatbotOptions">
            <button class="chat-option-btn" data-text="عندي فكرة مشروع، ممكن أستشيركم؟">عندي فكرة مشروع، ممكن أستشيركم؟</button>
            <button class="chat-option-btn" data-text="بدي أعرف تكلفة ومدة تنفيذ مشروعي">بدي أعرف تكلفة ومدة تنفيذ مشروعي</button>
            <button class="chat-option-btn" data-text="ممكن أشوف أعمالكم السابقة؟">ممكن أشوف أعمالكم السابقة؟</button>
          </div>
          <form id="chatForm" class="chat-form">
            <input type="text" id="chatInput" placeholder="اكتب استفسارك هنا..." autocomplete="off" required>
            <button type="submit" aria-label="إرسال" id="chatSendBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
      <button class="chatbot-launcher" id="chatbotLauncher" aria-label="فتح المحادثة">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </div>
  `;
  
  // Inject into body
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  
  const launcher = document.getElementById('chatbotLauncher');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const chatBody = document.getElementById('chatbotBody');
  const optionsContainer = document.getElementById('chatbotOptions');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  
  let chatHistory = [];
  
  // Toggle Chat
  function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatBody.scrollTop = chatBody.scrollHeight;
      chatInput.focus();
    }
  }
  
  launcher.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  async function sendMessage(text) {
    if (!text.trim()) return;
    
    // Hide quick options forever after first message
    if (optionsContainer) {
      optionsContainer.style.display = 'none';
    }
    
    // Add user message to UI
    chatBody.insertAdjacentHTML('beforeend', `<div class="chat-message user-message">${text}</div>`);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    chatBody.insertAdjacentHTML('beforeend', `
      <div class="typing-indicator" id="${typingId}">
        <span></span><span></span><span></span>
      </div>
    `);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Disable input
    chatInput.disabled = true;
    chatSendBtn.disabled = true;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory })
      });
      
      // Add to local history after sending
      chatHistory.push({ role: 'user', text: text });
      
      const data = await response.json();
      
      // Remove typing indicator
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      
      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      
      // Format text (basic markdown to HTML)
      let formattedReply = data.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedReply = formattedReply.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--primary); text-decoration: underline;">$1</a>');
      formattedReply = formattedReply.replace(/\n/g, '<br>');
      
      // Add bot message to UI
      chatBody.insertAdjacentHTML('beforeend', `<div class="chat-message bot-message">${formattedReply}</div>`);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      // Add to history
      chatHistory.push({ role: 'model', text: data.reply });
      
    } catch (error) {
      console.error('Chat error:', error);
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      
      chatBody.insertAdjacentHTML('beforeend', `<div class="chat-message bot-message" style="background:#ff3b30;">عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً أو التواصل عبر الواتساب.</div>`);
      chatBody.scrollTop = chatBody.scrollHeight;
    } finally {
      // Enable input
      chatInput.disabled = false;
      chatSendBtn.disabled = false;
      chatInput.focus();
    }
  }

  // Handle Form Submit
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = chatInput.value;
    chatInput.value = '';
    sendMessage(text);
  });
  
  // Handle Quick Option Click
  document.querySelectorAll('.chat-option-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const text = this.getAttribute('data-text');
      sendMessage(text);
    });
  });
});
