# Commun.io - Chat Application

**Developed by Varsz**

Welcome to **Commun.io**, a simple real-time chat application where users can register, login, and exchange private messages securely.

## ✨ Features

- **User Registration and Login**  
  Users can create an account and log in with their credentials.

- **Real-Time Messaging**  
  Powered by WebSockets (Socket.io), enabling live chat updates without refreshing.

- **Private Messaging**  
  Messages are sent privately between users.

- **Simple and Responsive UI**  
  Clean and responsive front-end design using HTML, CSS, and JavaScript.

- **About Page**  
  Provides a brief description of the application.

---

## 🛠️ Tech Stack

- **Frontend:**  
  - HTML5  
  - CSS3  
  - JavaScript (Vanilla)

- **Backend:**  
  - Node.js  
  - Socket.io

- **Version Control:**  
  - Git and GitHub
 

## Screenshots
![Screenshot Entry Page](https://github.com/user-attachments/assets/8de6894f-4057-44a0-8f97-ec5ca5949fd5)
*Entry page*

![Screenshot Login](https://github.com/user-attachments/assets/516864d2-98a7-4685-9954-6224747541e7)
*Glimpse of login*

![Screenshot 2025-04-10 205538](https://github.com/user-attachments/assets/8e3b3432-b47e-4804-8a04-373a862e8395)
*Working example(logged in through different portals)*






  
## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Git installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Varsha620/communo.io.git
   cd communo.io
   ```

2. Install dependencies (assuming you have a server setup):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open the app:
   - Navigate to `http://localhost:3000/login.html` to login
   - Or `http://localhost:3000/register.html` to create a new account

---

## ⚠️ Known Issues

- JWT token handling and user authentication are hardcoded placeholders currently (`user_jwt_token`, `recipient_user_id` in `script.js`).

---

## 💡 Future Improvements

- Proper login/logout system with session management
- Real user-to-user private messaging
- User online/offline status
- Message persistence (database)
- Profile pictures and user settings
- Better error handling and validations

---

## 🧑‍💻 Developer

**Varsz**  
Feel free to connect and contribute!
