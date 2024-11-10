// Initialize the socket connection
const socket = io("http://localhost:3000", {
    auth: { token: localStorage.getItem("token") }
});

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");
const userList = document.getElementById("userList");
let currentRecipientId = null;

// Send message to the server
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message && currentRecipientId) {
        socket.emit("privateMessage", { recipientId: currentRecipientId, message });
        messageInput.value = ""; // Clear the input
    }
});


// Client side: Receive and store the user ID
socket.on("userId", (userId) => {
    socket.userId = userId; // Store the user ID for identifying sent messages
});


// Listen for the updated online users list
socket.on("updateUserList", (users) => {
    userList.innerHTML = ""; // Clear previous list
    users.forEach((user) => {
        if (user.userId && user.username) {  // Ensure both userId and username are available
            const userElement = document.createElement("div");
            userElement.classList.add("user");
            userElement.textContent = user.username;
            userElement.dataset.userId = user.userId;
            userElement.addEventListener("click", () => startChat(user.userId, user.username));
            userList.appendChild(userElement);
        }
    });
});

function fetchPreviousMessages(userId) {
    socket.emit("requestPreviousMessages", userId); // Send a request to the server
}


// Start chat with a selected user
function startChat(userId, username) {
    currentRecipientId = userId;
    document.getElementById("chatWith").textContent = `Chatting with ${username}`;
    messagesContainer.innerHTML = ""; // Clear chat history display

    // Join the private room for direct messages
    socket.emit("joinRoom", userId);

    // Request previous messages for this user
    fetchPreviousMessages(userId);
}

// Display real-time messages, but only if they are for the active chat room
socket.on("message", (msg) => {
    if (msg.senderId === currentRecipientId || msg.recipientId === currentRecipientId) {
        const isSender = msg.senderId === socket.userId;
        displayMessage(msg, isSender);
    }
});

// Display previous messages for the selected user only
socket.on("previousMessages", ({ user, messages }) => {
    if (user === currentRecipientId) {
        messagesContainer.innerHTML = ""; // Clear previous chat history
        messages.forEach((message) => displayMessage(message, message.senderId === socket.userId));
    }
});

// Function to display a message in the chat window
function displayMessage(msg, isSender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", isSender ? "self" : "other"); // Apply "self" for sender, "other" for recipient
    messageElement.innerHTML = `
        <div class="text">${msg.text}</div>
        <div class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the latest message
}

// Handle logout
document.getElementById("logoutButton").addEventListener("click", () => {
    // Disconnect the user from the socket
    socket.disconnect();

    // Redirect to the login page
    window.location.href = "login.html";
});


