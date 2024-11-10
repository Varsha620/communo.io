const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log("Received registration:", req.body); // Log incoming data

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        console.log("User saved:", user); // Log saved user data
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error); // Log any errors
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("Database password hash:", user.password); // Log the stored hash
        console.log("Received password for comparison:", password); // Log the entered password

        // Verify hashed password
        const hash = bcrypt.hashSync(password, 10); // Hash the received password
        console.log("Generated hash:", hash);
        console.log("Stored hash:", user.password);
        
        // Manually compare
        if (hash === user.password) {
            console.log("Manually hashed passwords match.");
        } else {
            console.log("Manually hashed passwords do NOT match.");
        }
        

        // If login is successful, create a token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});



module.exports = router;
