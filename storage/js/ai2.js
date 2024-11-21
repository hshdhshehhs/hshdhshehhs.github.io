const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAXdktHdvjI6WqTFj-4nNDBO_sSqDk4pa4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let messageHistory = [
   { role: "system", content: "You are the best code helper and generator,  you are also the best and smartest at Math, science, history, and geography, you will try your hardest in everything" }
];

let sessionMemory = {
    userName: '', 
    favoriteColor: '', 
    lastResult: null,
    facts: {},
    userQuestions: []
};

function addMessage(role, message) {
    chatContainer.innerHTML += `<p><strong>${role}:</strong> ${message}</p>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('p');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = '<strong>AI:</strong> Typing...';
    chatContainer.appendChild(typingIndicator);
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

function updateSessionMemory(key, value) {
    sessionMemory[key] = value;
}

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    addMessage("You", userMessage);
    userInput.value = '';
    messageHistory.push({ role: "user", content: userMessage });

    showTypingIndicator();

    try {
        let responseMessage = '';

        if (/^\d+\s*[\+\-\*\/]\s*\d+$/.test(userMessage)) {
            const result = eval(userMessage);
            responseMessage = `The result of ${userMessage} is ${result}.`;
            updateSessionMemory('lastResult', result);
        } else if (userMessage.toLowerCase().includes('add')) {
            const lastResult = sessionMemory.lastResult || 0;
            const addValue = parseFloat(userMessage.match(/\d+/)[0]);
            const newResult = lastResult + addValue;
            responseMessage = `Adding ${addValue} to ${lastResult} gives ${newResult}.`;
            updateSessionMemory('lastResult', newResult);
        } else if (userMessage.toLowerCase().includes('my name is')) {
            const name = userMessage.split('is')[1].trim();
            sessionMemory.userName = name;
            responseMessage = `Nice to meet you, ${name}!`;
            updateSessionMemory('userName', name);
        } else if (userMessage.toLowerCase().includes('remember that')) {
            const fact = userMessage.split('remember that')[1].trim();
            sessionMemory.facts[fact] = true;
            responseMessage = `Got it! I'll remember that: "${fact}".`;
        } else if (userMessage.toLowerCase().includes('what do you remember')) {
            const facts = Object.keys(sessionMemory.facts);
            responseMessage = facts.length > 0 ? `I remember these things: ${facts.join(', ')}.` : "I don't remember anything yet.";
        } else {
            const prompt = messageHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
            const result = await model.generateContent(prompt);
            responseMessage = result.response.text();
        }

        removeTypingIndicator();
        addMessage("AI", responseMessage);
        messageHistory.push({ role: "assistant", content: responseMessage });
    } catch (error) {
        removeTypingIndicator();
        addMessage("Error", `Failed to get AI response. Error details: ${error.message}`);
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
