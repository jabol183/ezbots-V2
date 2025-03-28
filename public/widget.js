/**
 * EzAIBotz Chat Widget
 * 
 * This script creates a floating chat widget that can be embedded on any website.
 * 
 * Usage:
 * <script 
 *   src="https://your-domain.com/widget.js" 
 *   data-chatbot-id="your-chatbot-id"
 *   data-primary-color="#4F46E5" 
 *   data-api-url="https://your-domain.com/api/chat"
 *   data-welcome-message="Custom welcome message">
 * </script>
 * 
 * For inline embedding, you can use an iframe instead:
 * <iframe src="https://your-domain.com/embed/your-chatbot-id" width="400" height="600" frameBorder="0"></iframe>
 */

(function() {
  // Get script element
  const scriptElement = document.currentScript;
  
  // Get configuration from data attributes
  const config = {
    chatbotId: scriptElement.dataset.chatbotId,
    primaryColor: scriptElement.dataset.primaryColor || '#4F46E5',
    apiUrl: scriptElement.dataset.apiUrl || window.location.origin + '/api/chat',
    welcomeMessage: scriptElement.dataset.welcomeMessage || 'Hello! How can I help you today?',
    buttonText: scriptElement.dataset.buttonText || 'Chat with us',
    position: scriptElement.dataset.position || 'right' // right or left
  };
  
  // Make sure chatbotId is provided
  if (!config.chatbotId) {
    console.error('EzAIBotz Widget Error: Missing data-chatbot-id attribute');
    return;
  }
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.style.position = 'fixed';
  widgetContainer.style.bottom = '20px';
  widgetContainer.style[config.position] = '20px';
  widgetContainer.style.zIndex = '9999';
  widgetContainer.className = 'ezaibotz-widget';
  
  // Create chat button
  const chatButton = document.createElement('button');
  chatButton.style.width = '60px';
  chatButton.style.height = '60px';
  chatButton.style.borderRadius = '50%';
  chatButton.style.backgroundColor = config.primaryColor;
  chatButton.style.color = 'white';
  chatButton.style.border = 'none';
  chatButton.style.cursor = 'pointer';
  chatButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  chatButton.style.display = 'flex';
  chatButton.style.alignItems = 'center';
  chatButton.style.justifyContent = 'center';
  chatButton.style.transition = 'transform 0.3s ease';
  chatButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  
  // Add hover effects
  chatButton.addEventListener('mouseover', function() {
    chatButton.style.transform = 'scale(1.05)';
  });
  
  chatButton.addEventListener('mouseout', function() {
    chatButton.style.transform = 'scale(1)';
  });
  
  // Create chat window (hidden by default)
  const chatWindow = document.createElement('div');
  chatWindow.style.position = 'absolute';
  chatWindow.style.bottom = '70px';
  chatWindow.style[config.position] = '0';
  chatWindow.style.width = '350px';
  chatWindow.style.height = '500px';
  chatWindow.style.backgroundColor = 'white';
  chatWindow.style.borderRadius = '10px';
  chatWindow.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.border = '1px solid rgba(0, 0, 0, 0.1)';
  
  // Create chat header
  const chatHeader = document.createElement('div');
  chatHeader.style.padding = '15px';
  chatHeader.style.backgroundColor = config.primaryColor;
  chatHeader.style.color = 'white';
  chatHeader.style.fontFamily = 'Arial, sans-serif';
  chatHeader.style.fontWeight = 'bold';
  chatHeader.style.display = 'flex';
  chatHeader.style.justifyContent = 'space-between';
  chatHeader.style.alignItems = 'center';
  chatHeader.innerHTML = `
    <span>Chat Assistant</span>
    <button class="close-button" style="background: none; border: none; color: white; cursor: pointer;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  
  // Create messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.style.flex = '1';
  messagesContainer.style.overflowY = 'auto';
  messagesContainer.style.padding = '15px';
  messagesContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Create connection status indicator
  const statusIndicator = document.createElement('div');
  statusIndicator.style.padding = '5px 10px';
  statusIndicator.style.fontSize = '12px';
  statusIndicator.style.color = '#666';
  statusIndicator.style.textAlign = 'center';
  statusIndicator.style.display = 'none';
  statusIndicator.textContent = 'Connecting...';
  
  // Add welcome message
  const welcomeMessageElement = document.createElement('div');
  welcomeMessageElement.style.padding = '10px';
  welcomeMessageElement.style.backgroundColor = '#f0f0f0';
  welcomeMessageElement.style.borderRadius = '10px';
  welcomeMessageElement.style.marginBottom = '10px';
  welcomeMessageElement.style.maxWidth = '80%';
  welcomeMessageElement.textContent = config.welcomeMessage;
  messagesContainer.appendChild(welcomeMessageElement);
  
  // Create input area
  const inputArea = document.createElement('div');
  inputArea.style.padding = '10px';
  inputArea.style.borderTop = '1px solid #e0e0e0';
  inputArea.style.display = 'flex';
  
  // Create input field
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Type a message...';
  inputField.style.flex = '1';
  inputField.style.padding = '10px';
  inputField.style.border = '1px solid #e0e0e0';
  inputField.style.borderRadius = '5px 0 0 5px';
  inputField.style.outline = 'none';
  inputField.style.fontFamily = 'Arial, sans-serif';
  
  // Create send button
  const sendButton = document.createElement('button');
  sendButton.style.padding = '10px 15px';
  sendButton.style.backgroundColor = config.primaryColor;
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '0 5px 5px 0';
  sendButton.style.cursor = 'pointer';
  sendButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  `;
  
  // Assemble the widget
  inputArea.appendChild(inputField);
  inputArea.appendChild(sendButton);
  chatWindow.appendChild(chatHeader);
  chatWindow.appendChild(statusIndicator);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputArea);
  widgetContainer.appendChild(chatButton);
  widgetContainer.appendChild(chatWindow);
  document.body.appendChild(widgetContainer);
  
  // Session ID for tracking conversation
  let sessionId = '';
  
  // Add event listeners
  chatButton.addEventListener('click', function() {
    chatWindow.style.display = 'flex';
    chatButton.style.display = 'none';
    inputField.focus();
  });
  
  chatHeader.querySelector('.close-button').addEventListener('click', function() {
    chatWindow.style.display = 'none';
    chatButton.style.display = 'flex';
  });
  
  // Function to add a message to the chat
  function addMessage(text, isUser) {
    const messageElement = document.createElement('div');
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '10px';
    messageElement.style.marginBottom = '10px';
    messageElement.style.maxWidth = '80%';
    messageElement.style.wordBreak = 'break-word';
    
    if (isUser) {
      messageElement.style.backgroundColor = '#e6f7ff';
      messageElement.style.marginLeft = 'auto';
    } else {
      messageElement.style.backgroundColor = '#f0f0f0';
    }
    
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Loading indicator
  function showLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-indicator';
    loadingElement.style.padding = '10px';
    loadingElement.style.backgroundColor = '#f0f0f0';
    loadingElement.style.borderRadius = '10px';
    loadingElement.style.marginBottom = '10px';
    loadingElement.style.maxWidth = '80%';
    loadingElement.style.display = 'flex';
    loadingElement.innerHTML = `
      <div style="width: 8px; height: 8px; background-color: #888; border-radius: 50%; margin: 0 2px; animation: ezaibotz-bounce 1.4s infinite ease-in-out both;"></div>
      <div style="width: 8px; height: 8px; background-color: #888; border-radius: 50%; margin: 0 2px; animation: ezaibotz-bounce 1.4s infinite ease-in-out both; animation-delay: 0.16s;"></div>
      <div style="width: 8px; height: 8px; background-color: #888; border-radius: 50%; margin: 0 2px; animation: ezaibotz-bounce 1.4s infinite ease-in-out both; animation-delay: 0.32s;"></div>
    `;
    messagesContainer.appendChild(loadingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return loadingElement;
  }
  
  // Create CSS animation for loading dots
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ezaibotz-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
  `;
  document.head.appendChild(style);
  
  // Function to remove loading indicator
  function removeLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }
  
  // Function to show connection status
  function showStatus(message, isError = false) {
    statusIndicator.textContent = message;
    statusIndicator.style.display = 'block';
    statusIndicator.style.color = isError ? '#e53e3e' : '#666';
    statusIndicator.style.backgroundColor = isError ? '#fff5f5' : 'transparent';
    
    if (!isError) {
      setTimeout(() => {
        statusIndicator.style.display = 'none';
      }, 3000);
    }
  }
  
  // Function to send message to API
  async function sendMessage(message) {
    if (!message.trim()) return;
    
    try {
      const loadingIndicator = showLoadingIndicator();
      
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          message,
          chatbotId: config.chatbotId,
          sessionId
        })
      });
      
      removeLoadingIndicator();
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Save the session ID if it's the first message
      if (!sessionId && data.sessionId) {
        sessionId = data.sessionId;
      }
      
      // Add bot response to chat
      addMessage(data.botResponse || data.response || 'Sorry, I didn\'t understand that.', false);
      
    } catch (error) {
      console.error('Error sending message:', error);
      removeLoadingIndicator();
      
      // Show error in chat
      showStatus(`Error: ${error.message}`, true);
      addMessage('Sorry, I encountered an error. Please try again later.', false);
    }
  }
  
  // Send message when button is clicked
  sendButton.addEventListener('click', function() {
    const message = inputField.value.trim();
    if (message) {
      addMessage(message, true);
      inputField.value = '';
      sendMessage(message);
    }
  });
  
  // Send message when Enter key is pressed
  inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const message = inputField.value.trim();
      if (message) {
        addMessage(message, true);
        inputField.value = '';
        sendMessage(message);
      }
    }
  });
  
  // Add accessibility attributes
  chatButton.setAttribute('aria-label', 'Open chat');
  chatButton.setAttribute('title', 'Chat with us');
  inputField.setAttribute('aria-label', 'Type your message');
  sendButton.setAttribute('aria-label', 'Send message');
})(); 