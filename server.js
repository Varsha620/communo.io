require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

// Import routes and models
const authRoutes = require("./routes/auth");
const Message = require("./models/Message");
const User = require("./models/User");

// Initialize express app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/", authRoutes); // or "/auth", depending on your routing structure

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);

let onlineUsers = {};

// Socket.io middleware for JWT authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error("Authentication error"));
        socket.user = user;
        onlineUsers[socket.user.userId] = socket.user.username;
        io.emit("updateUserList", Object.values(onlineUsers));
        next();
    });
});

io.on("connection", (socket) => {
    socket.emit("userId", socket.user.userId); // Send userId to client on connection
    const { userId, username } = socket.user;
    onlineUsers[userId] = { userId, username };
    console.log(`User connected: ${username}`);

    // Emit the updated online users list to all clients
    io.emit("updateUserList", Object.values(onlineUsers));

    // Handle joining a private room and send chat history for that room
    socket.on("joinRoom", async (recipientId) => {
        const roomId = [userId, recipientId].sort().join("-");
        socket.join(roomId);
        socket.roomId = roomId;
        
        console.log(`User ${username} joined room: ${roomId}`);
        
        // Fetch and send chat history for this specific room
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId },
                { senderId: recipientId, recipientId: userId }
            ]
        }).sort({ timestamp: 1 });
        
        socket.emit("previousMessages", { roomId, messages });
    });

    // Server side in server.js
    socket.on("requestPreviousMessages", async (recipientId) => {
        const userId = socket.user.userId;
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: recipientId },
                { senderId: recipientId, recipientId: userId }
            ]
        }).sort({ timestamp: 1 });

        // Send these messages back to the client
        socket.emit("previousMessages", { user: recipientId, messages });
    });


    // Handle private messaging
    socket.on("privateMessage", async ({ recipientId, message }) => {
        const roomId = [userId, recipientId].sort().join("-");

        // Save the message in the database
        const msg = await Message.create({
            senderId: userId,
            recipientId,
            text: message,
            timestamp: new Date()
        });

        // Emit the message only to the recipient and sender
        io.to(roomId).emit("message", {
            senderId: userId,
            recipientId,
            text: message,
            timestamp: msg.timestamp
        });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        delete onlineUsers[userId];
        io.emit("updateUserList", Object.values(onlineUsers));
        console.log(`User disconnected: ${username}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
