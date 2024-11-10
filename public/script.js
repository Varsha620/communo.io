const socket = io({
    auth: {
      token: "user_jwt_token" // Replace with actual JWT token after login
    }
  });
  
  function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const recipientId = "recipient_user_id"; // Replace with actual recipient ID
    socket.emit("privateMessage", { recipientId, message });
  }
  
  socket.on("message", (msg) => {
    const chat = document.getElementById("chat");
    chat.innerHTML += `<p>${msg.senderId}: ${msg.text}</p>`;
  });
  