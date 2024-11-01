import { db, ref, push, onValue } from '/src/js/firebase-init.js';

function initChat() {
    const chatRef = ref(db, 'chats');
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.innerHTML = `
        <div class="chat-box">
            <div class="chat-header">
                <h3>Chat</h3>
                <button class="minimize-chat">−</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Type a message..." id="messageInput">
                <button id="sendMessage">Send</button>
            </div>
        </div>
    `;

    document.body.appendChild(chatContainer);

    const messagesDiv = chatContainer.querySelector('.chat-messages');
    const messageInput = chatContainer.querySelector('#messageInput');
    const sendButton = chatContainer.querySelector('#sendMessage');
    const minimizeButton = chatContainer.querySelector('.minimize-chat');
    const chatBox = chatContainer.querySelector('.chat-box');

    // Listen for new messages
    onValue(chatRef, (snapshot) => {
        messagesDiv.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${message.isUser ? 'user-message' : 'guest-message'}`;
            messageElement.innerHTML = `
                <span class="message-sender">${message.sender}:</span>
                <span class="message-text">${message.text}</span>
                <span class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</span>
            `;
            messagesDiv.appendChild(messageElement);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Send message
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text) {
            const user = auth.currentUser;
            push(chatRef, {
                text: text,
                sender: user ? user.email : 'Guest',
                isUser: !!user,
                timestamp: Date.now()
            });
            messageInput.value = '';
        }
    }

    // Event listeners
    sendButton.onclick = sendMessage;
    messageInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Minimize/Maximize chat
    let isMinimized = false;
    minimizeButton.onclick = () => {
        isMinimized = !isMinimized;
        messagesDiv.style.display = isMinimized ? 'none' : 'block';
        chatContainer.querySelector('.chat-input').style.display = isMinimized ? 'none' : 'flex';
        minimizeButton.textContent = isMinimized ? '+' : '−';
        chatBox.style.height = isMinimized ? 'auto' : '400px';
    };
}

document.addEventListener('DOMContentLoaded', initChat);