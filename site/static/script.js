function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    var chatBox = document.getElementById("chat-box");

    // Display user message
    chatBox.innerHTML += "<p>User: " + userInput + "</p>";

    // Send user message to Flask backend
    fetch("/get-response", {
        method: "POST",
        body: JSON.stringify({ message: userInput }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        // Display bot response
        chatBox.innerHTML += "<p>Bot: " + data.response + "</p>";
    });

    // Clear input field
    document.getElementById("user-input").value = "";
}
