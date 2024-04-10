function sendMessage(message) {
    fetch('/get_question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: message }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.end) {
            displayMessage(data.end);
            
        } else {
            displayQuestion(data.question);
            updateMapFromServer();
            // Assuming you have the selected country in data
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayQuestion(question) {
    const chatBox = document.getElementById('chat-box');
    question = 'Bot: ' + question + '<br>';
    chatBox.innerHTML += `<div class="bot-message">${question}</div>`;
}

function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    message = 'You: ' + message + '<br>';
    chatBox.innerHTML += `<div class="bot-message">${message}</div>`;
}

function sendMessageHandler() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    displayMessage(message); // Display the user's message
    userInput.value = ''; // Clear the input field
    sendMessage(message); // Send the user's message to the server
}

document.getElementById('send-button').addEventListener('click', sendMessageHandler);

function resetChatSession() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = 'Welcome to COVID BOT'; // Clear chat history
    fetch('/reset_chat_session', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        // Handle any errors here
    });
    initiateConversation();
}

// Add event listener to the "Reset" button
document.getElementById('reset-button').addEventListener('click', resetChatSession);

// Add this function to initiate the conversation when the page loads
function initiateConversation() {
    fetch('/get_question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: '' }), // Send an empty message initially
    })
    .then(response => response.json())
    .then(data => {
        if (data.question) {
            displayQuestion(data.question); // Display the first question
        } else {
            console.error('Unexpected response:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Call initiateConversation when the page loads
window.addEventListener('load', resetChatSession);


