const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    const apiKey = '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'; 
    let messageHistory = [
        { role: "system", content: "You are a helpful AI assistant." }
    ];

    function addMessage(role, message) {
        const p = document.createElement('p');
        p.classList.add(role === 'You' ? 'user-message' : 'ai-message');
        p.innerHTML = `<strong>${role}:</strong> ${message}`;
        chatContainer.appendChild(p);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('p');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = '<strong>AI:</strong> Giving you youre answer!...';
        chatContainer.appendChild(typingIndicator);
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        addMessage("You", userMessage);
        userInput.value = '';
        messageHistory.push({ role: "user", content: userMessage });

        showTypingIndicator();

        try {
            const responseMessage = await getAiResponse(userMessage);
            removeTypingIndicator();
            addMessage("AI", responseMessage);
            messageHistory.push({ role: "assistant", content: responseMessage });
        } catch (error) {
            removeTypingIndicator();
            addMessage("Error", `Failed to get AI response. Error details: ${error.message}`);
        }
    }

    async function getAiResponse(userMessage) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    ...messageHistory
                ],
                temperature: 0.9,
                max_tokens: 1024,
                stream: false
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return data.choices[0].message.content;
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });