function togglePassword() {
  var password = document.getElementById("password");
  var icon = document.getElementById("toggle-icon");
  if (password.type === "password") {
    password.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    password.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

function showSignUp() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
}

function showLogin() {
  document.getElementById("login-container").style.display = "block";
  document.getElementById("signup-container").style.display = "none";
}

// document.getElementById('loginButton').addEventListener('click', function () {
//     window.location.href = '../html/home.html'; // Replace with your actual login page URL
// });
