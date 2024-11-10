  // Handle registration
  document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const username = document.getElementById("regusername").value;
    const password = document.getElementById("regpassword").value;
    const confirmPassword = document.getElementById("repassword").value;
  
    // Check for matching passwords
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    if (!username || !password) {
      alert("Please enter both a username and password.");
      return;
    }
  
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("Registration successful! You can now log in.");
      window.location.href = "login.html"; 
    } else {
      alert(data.message || "Error during registration.");
    }
});