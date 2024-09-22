document.addEventListener("DOMContentLoaded", function () {
  get_user();
});

function get_user() {
  fetch("../php/get_all_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const tableBody = document.querySelector("#user-table tbody");
        tableBody.innerHTML = ""; // Bersihkan table sebelum diisi

        data.forEach((user) => {
          const row = document.createElement("tr");

          // Kolom id
          const cellId = document.createElement("td");
          cellId.textContent = user.id;
          row.appendChild(cellId);

          // Kolom username
          const cellUsername = document.createElement("td");
          cellUsername.textContent = user.username;
          row.appendChild(cellUsername);

          // Kolom email
          const cellEmail = document.createElement("td");
          cellEmail.textContent = user.email;
          row.appendChild(cellEmail);

          // Kolom telepon
          const cellTelepon = document.createElement("td");
          cellTelepon.textContent = user.no_telp;
          row.appendChild(cellTelepon);

          // Kolom alamat
          const cellAlamat = document.createElement("td");
          cellAlamat.textContent = user.alamat;
          row.appendChild(cellAlamat);

          // Kolom aksi (icon hapus)
          const cellAksi = document.createElement("td");
          const deleteIcon = document.createElement("i");
          deleteIcon.classList.add("fas", "fa-trash", "delete-icon");
          deleteIcon.style.cursor = "pointer";
          deleteIcon.addEventListener("click", () => deleteUser(user.id)); // Event listener untuk hapus user
          cellAksi.appendChild(deleteIcon);
          row.appendChild(cellAksi);

          tableBody.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Fungsi untuk menghapus user
function deleteUser(userId) {
  if (confirm("Apakah kamu yakin ingin menghapus user ini?")) {
    fetch(`../php/delete_user.php?id=${userId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("User berhasil dihapus");
          get_user(); // Refresh table setelah penghapusan
        } else {
          alert("Gagal menghapus user: " + data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  }
}
