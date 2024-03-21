// This function sends a message to the server and receives a response
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
            // If the response indicates the end of questions, display a completion message
            displayMessage(data.end);
        } else {
            // Otherwise, display the next question to the user
            displayQuestion(data.question);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle any errors here
    });
}

// This function displays a question to the user
function displayQuestion(question) {
    const chatBox = document.getElementById('chat-box');
    question = 'Bot: ' + question + '<br>';
    chatBox.innerHTML += `<div class="bot-message">${question}</div>`;
}

// This function displays a message from the server
function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    message = 'You: ' + message + '<br>';
    chatBox.innerHTML += `<div class="bot-message">${message}</div>`;
}

// This function is called when the user clicks the "Send" button
function sendMessageHandler() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    displayMessage(message); // Display the user's message
    userInput.value = ''; // Clear the input field
    sendMessage(message); // Send the user's message to the server
}

// Add event listener to the "Send" button
document.getElementById('send-button').addEventListener('click', sendMessageHandler);


// Function to reset the chat session and recover all answers
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
}

// Add event listener to the "Reset" button
document.getElementById('reset-button').addEventListener('click', resetChatSession);