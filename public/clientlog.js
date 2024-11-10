//handle login
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Store token in localStorage and redirect to chat
      localStorage.setItem("token", data.token);
      window.location.href = "/chat.html";
    } else {
      alert(data.message);
    }
  });




  