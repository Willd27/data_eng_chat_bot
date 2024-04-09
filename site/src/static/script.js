var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

var markers = {};

function updateMap(country, count) {
    // Utilisez l'API de géolocalisation Nominatim pour obtenir les coordonnées du pays
    fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if (!markers[country]) {
                markers[country] = L.circleMarker([lat, lon], {
                    radius: 5,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);
            }
            markers[country].setRadius(count);
        } else {
            console.error(`Coordinates not found for ${country}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function updateMapFromServer() {
    fetch('/update_map', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        var countryCounts = {};
        data.countries.forEach(country => {
            if (countryCounts[country]) {
                countryCounts[country]++;
            } else {
                countryCounts[country] = 1;
            }
        });

        // Parcourez le tableau des pays et de leurs comptages
        for (const [country, count] of Object.entries(countryCounts)) {
            updateMap(country, count); // Mettre à jour la carte pour chaque pays avec son comptage
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Gérez les erreurs ici
    });
}

// Call updateMapFromServer when the page loads
window.addEventListener('load', updateMapFromServer);

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


