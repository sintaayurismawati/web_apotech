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

function login(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("loginForm"));

  // Fetch ke PHP untuk memeriksa login
  fetch("../php/login.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        // window.location.href = "../html/home.html";
        window.location.href = data.redirect;
      } else {
        showModalFail("Username / password salah.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showModalFail("Terjadi kesalahan jaringan.");
    });
}

function showModalFail(keterangan) {
  var modalHTML = `
                    <div id="modal-fail" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                          <img src="../images/fail-icon.png" alt="Fail Image" style="max-width: 100px; margin-bottom: 10px;">    
                          <h2>Gagal</h2>
                          <p>${keterangan}</p>
                          <button onclick="closeModal('modal-fail')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function closeModal(modal_id) {
  document.getElementById(modal_id).remove();
  document.body.style.overflow = "";
}
