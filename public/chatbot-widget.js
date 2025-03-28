(function() {
  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    
    if (script.readyState) {  // For old IE
      script.onreadystatechange = function() {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function() {
        callback();
      };
    }
    
    document.head.appendChild(script);
  }

  function loadStylesheet(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
  }
  
  // Get current script and read data attributes
  const currentScript = document.currentScript;
  const chatbotId = currentScript.getAttribute('data-chatbot-id');
  const apiEndpoint = currentScript.getAttribute('data-api-endpoint') || window.location.origin + '/api/chat';
  const themeColor = currentScript.getAttribute('data-theme-color') || '#4F46E5';
  const bubbleText = currentScript.getAttribute('data-bubble-text') || 'Chat with us';
  
  // Create chatbot container
  function createChatbotWidget() {
    // Create styles
    const styles = document.createElement('style');
    styles.textContent = `
      .ezaibotz-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      .ezaibotz-chat-bubble {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${themeColor};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      .ezaibotz-chat-bubble:hover {
        transform: scale(1.05);
      }
      .ezaibotz-chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      .ezaibotz-chat-header {
        background-color: ${themeColor};
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }
      .ezaibotz-chat-close {
        cursor: pointer;
        font-size: 20px;
        line-height: 20px;
      }
      .ezaibotz-chat-body {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      .ezaibotz-chat-footer {
        padding: 10px;
        border-top: 1px solid #eee;
        display: flex;
      }
      .ezaibotz-chat-input {
        flex: 1;
        border: 1px solid #ddd;
        border-radius: 20px;
        padding: 8px 15px;
        outline: none;
      }
      .ezaibotz-chat-send {
        background-color: ${themeColor};
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 15px;
        margin-left: 10px;
        cursor: pointer;
      }
      .ezaibotz-message {
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        margin-bottom: 10px;
        word-break: break-word;
      }
      .ezaibotz-message-user {
        align-self: flex-end;
        background-color: ${themeColor};
        color: white;
      }
      .ezaibotz-message-bot {
        align-self: flex-start;
        background-color: #f1f1f1;
        color: #333;
      }
      .ezaibotz-typing {
        align-self: flex-start;
        background-color: #f1f1f1;
        color: #888;
        padding: 10px 15px;
        border-radius: 18px;
        margin-bottom: 10px;
      }
      .ezaibotz-typing-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #888;
        margin-right: 3px;
        animation: ezaibotz-typing 1s infinite;
      }
      .ezaibotz-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .ezaibotz-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes ezaibotz-typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styles);
    
    // Create widget elements
    const container = document.createElement('div');
    container.className = 'ezaibotz-widget-container';
    
    const chatBubble = document.createElement('div');
    chatBubble.className = 'ezaibotz-chat-bubble';
    chatBubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    chatBubble.setAttribute('title', bubbleText);
    
    const chatWindow = document.createElement('div');
    chatWindow.className = 'ezaibotz-chat-window';
    
    const chatHeader = document.createElement('div');
    chatHeader.className = 'ezaibotz-chat-header';
    chatHeader.innerHTML = `
      <span>Chat Support</span>
      <span class="ezaibotz-chat-close">&times;</span>
    `;
    
    const chatBody = document.createElement('div');
    chatBody.className = 'ezaibotz-chat-body';
    
    const chatFooter = document.createElement('div');
    chatFooter.className = 'ezaibotz-chat-footer';
    chatFooter.innerHTML = `
      <input type="text" class="ezaibotz-chat-input" placeholder="Type a message...">
      <button class="ezaibotz-chat-send">Send</button>
    `;
    
    // Assemble the widget
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(chatBody);
    chatWindow.appendChild(chatFooter);
    container.appendChild(chatWindow);
    container.appendChild(chatBubble);
    document.body.appendChild(container);
    
    // Add event listeners
    chatBubble.addEventListener('click', function() {
      chatWindow.style.display = 'flex';
      chatBubble.style.display = 'none';
      
      // Add welcome message if chat is empty
      if (chatBody.children.length === 0) {
        addBotMessage('Hello! How can I help you today?');
      }
    });
    
    const closeBtn = chatWindow.querySelector('.ezaibotz-chat-close');
    closeBtn.addEventListener('click', function() {
      chatWindow.style.display = 'none';
      chatBubble.style.display = 'flex';
    });
    
    const sendBtn = chatWindow.querySelector('.ezaibotz-chat-send');
    const inputField = chatWindow.querySelector('.ezaibotz-chat-input');
    
    const sendMessage = function() {
      const message = inputField.value.trim();
      if (message) {
        addUserMessage(message);
        inputField.value = '';
        showTypingIndicator();
        
        // Send message to API
        fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            chatbotId: chatbotId
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          removeTypingIndicator();
          addBotMessage(data.response);
        })
        .catch(error => {
          console.error('Error:', error);
          removeTypingIndicator();
          addBotMessage('Sorry, I encountered an error. Please try again later.');
        });
      }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    
    inputField.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // Helper functions for chat
  function addUserMessage(text) {
    const chatBody = document.querySelector('.ezaibotz-chat-body');
    const messageElement = document.createElement('div');
    messageElement.className = 'ezaibotz-message ezaibotz-message-user';
    messageElement.textContent = text;
    chatBody.appendChild(messageElement);
    scrollToBottom();
  }
  
  function addBotMessage(text) {
    const chatBody = document.querySelector('.ezaibotz-chat-body');
    const messageElement = document.createElement('div');
    messageElement.className = 'ezaibotz-message ezaibotz-message-bot';
    messageElement.textContent = text;
    chatBody.appendChild(messageElement);
    scrollToBottom();
  }
  
  function showTypingIndicator() {
    const chatBody = document.querySelector('.ezaibotz-chat-body');
    const typingElement = document.createElement('div');
    typingElement.className = 'ezaibotz-typing';
    typingElement.innerHTML = `
      <span class="ezaibotz-typing-dot"></span>
      <span class="ezaibotz-typing-dot"></span>
      <span class="ezaibotz-typing-dot"></span>
    `;
    typingElement.id = 'ezaibotz-typing-indicator';
    chatBody.appendChild(typingElement);
    scrollToBottom();
  }
  
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById('ezaibotz-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  function scrollToBottom() {
    const chatBody = document.querySelector('.ezaibotz-chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  // Initialize the chatbot widget
  document.addEventListener('DOMContentLoaded', function() {
    createChatbotWidget();
  });
  
  // If document is already loaded, initialize immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(createChatbotWidget, 1);
  }
})(); 