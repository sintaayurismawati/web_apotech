document.addEventListener("DOMContentLoaded", function () {
  get_user();
});

function get_user() {
  document.getElementById("user").style.display = "block";
  document.getElementById("product").style.display = "none";

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

function get_product() {
  document.getElementById("product").style.display = "block";
  document.getElementById("user").style.display = "none";

  fetch("../php/get_all_product.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const tableBody = document.querySelector("#product-table tbody");
        tableBody.innerHTML = ""; // Bersihkan table sebelum diisi

        data.forEach((product) => {
          const row = document.createElement("tr");

          // Kolom id
          const cellId = document.createElement("td");
          cellId.textContent = product.id;
          row.appendChild(cellId);

          // Kolom produk
          const cellProduct = document.createElement("td");
          cellProduct.textContent = product.nama_produk;
          row.appendChild(cellProduct);

          // Kolom vendor
          const cellVendor = document.createElement("td");
          cellVendor.textContent = product.nama_vendor;
          row.appendChild(cellVendor);

          // Kategori
          const cellKategori = document.createElement("td");
          cellKategori.textContent = product.kategori_produk;
          row.appendChild(cellKategori);

          // Harga
          const cellHarga = document.createElement("td");
          cellHarga.textContent = product.harga_produk;
          row.appendChild(cellHarga);

          // Stok
          const cellStok = document.createElement("td");
          cellStok.textContent = product.jumlah_stok;
          row.appendChild(cellStok);

          // Deskripsi
          const cellDeskripsi = document.createElement("td");
          cellDeskripsi.textContent = product.deskripsi;
          row.appendChild(cellDeskripsi);

          // Kolom aksi (icon hapus)
          const cellAksi = document.createElement("td");
          const deleteIcon = document.createElement("i");
          deleteIcon.classList.add("fas", "fa-trash", "delete-icon");
          deleteIcon.style.cursor = "pointer";
          deleteIcon.addEventListener("click", () => deleteProduct(product.id)); // Event listener untuk hapus user
          cellAksi.appendChild(deleteIcon);
          row.appendChild(cellAksi);

          tableBody.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

function deleteProduct(productId) {
  if (confirm("Apakah kamu yakin ingin menghapus user ini?")) {
    fetch(`../php/delete_product.php?id=${productId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Product berhasil dihapus");
          get_product(); // Refresh table setelah penghapusan
        } else {
          alert("Gagal menghapus user: " + data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  }
}

// Ambil semua elemen <li> di dalam ul
const menuItems = document.querySelectorAll("#menu-list li");

// Tambahkan event listener untuk setiap <li>
menuItems.forEach((item) => {
  item.addEventListener("click", function () {
    // Hapus class 'active' dari semua item
    menuItems.forEach((li) => li.classList.remove("active"));

    // Tambahkan class 'active' ke item yang diklik
    this.classList.add("active");
  });
});
