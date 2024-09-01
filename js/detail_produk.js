document.addEventListener("DOMContentLoaded", () => {
  // Retrieve product and user data from localStorage
  const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
  console.log("Selected Product:", selectedProduct);

  if (selectedProduct) {
    document.getElementById("image_url").src = selectedProduct.image_url;
    document.getElementById("nama_produk").textContent =
      selectedProduct.nama_produk;
    document.getElementById(
      "harga_produk"
    ).textContent = `Rp${selectedProduct.harga_produk}`;
    document.getElementById(
      "jumlah_stok"
    ).textContent = `Tersisa : ${selectedProduct.jumlah_stok}`;
    document.getElementById("kategori_produk").textContent =
      selectedProduct.kategori_produk;
    document.getElementById("nama_vendor").textContent =
      selectedProduct.nama_vendor;
    document.getElementById("image_profil").src = selectedProduct.image_profil;

    document.getElementById("kota").textContent = selectedProduct.kota;
    document.getElementById("deskripsi-produk").textContent =
      selectedProduct.deskripsi;

    // Add hidden input for produk_id in the form
    const produkIdInput = document.createElement("input");
    produkIdInput.type = "hidden";
    produkIdInput.name = "produk_id";
    produkIdInput.value = selectedProduct.id;
    document.getElementById("addDetailBelanja").appendChild(produkIdInput);

    const produkIdInput2 = document.createElement("input");
    produkIdInput2.type = "hidden";
    produkIdInput2.name = "produk_id";
    produkIdInput2.value = selectedProduct.id;
    document.getElementById("addKeranjang").appendChild(produkIdInput2);

    document.getElementById("jumlah_beli").addEventListener("input", () => {
      const jumlahBeli =
        parseInt(document.getElementById("jumlah_beli").value, 10) || 0;
      const hargaProduk = parseInt(selectedProduct.harga_produk, 10) || 0;
      const total = jumlahBeli * hargaProduk;

      // Logging values to console for debugging
      console.log("Jumlah Beli:", jumlahBeli);
      console.log("Harga Produk:", hargaProduk);
      console.log("Total:", total);

      document.getElementById(
        "total"
      ).textContent = `Total: Rp${total.toLocaleString("id-ID")}`;
      document.getElementById("total_hidden").value = total;
    });

    document.getElementById("jumlah_keranjang").addEventListener("input", () => {
      const jumlahKeranjang =
        parseInt(document.getElementById("jumlah_keranjang").value, 10) || 0;
      const hargaProduk = parseInt(selectedProduct.harga_produk, 10) || 0;
      const total2 = jumlahKeranjang * hargaProduk;

      // Logging values to console for debugging
      console.log("Jumlah Keranjang:", jumlahKeranjang);
      console.log("Harga Produk:", hargaProduk);
      console.log("Total:", total2);

      document.getElementById(
        "total2"
      ).textContent = `Total: Rp${total2.toLocaleString("id-ID")}`;
      document.getElementById("total_hidden2").value = total2;
    });
  } else {
    alert("No product selected");
  }
});

function showAlamat() {
  fetch("../php/get_user_info.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data fetched:", data);

      if (data.error) {
        console.error("Error fetching user:", data.error);
      } else {
        console.log("User address:", data.alamat);
        document.getElementById("alamat").value = data.alamat;
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
}

function showAddDetailBelanja() {
  document.getElementById("modal-beli").style.display = "flex";

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function cekJumlahBeli(event) {
  event.preventDefault(); // Mencegah pengiriman formulir secara default

  var jumlah_stok = parseInt(
    document
      .getElementById("jumlah_stok")
      .textContent.replace("Tersisa : ", ""),
    10
  );
  var jumlah_beli = parseInt(document.getElementById("jumlah_beli").value, 10);

  if (jumlah_beli > jumlah_stok) {
    closeModal();
    var modalHTML = `
                    <div id="modal-error" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative;">
                            <span class="close" onclick="closeModal('modal-error')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                            <h2 style="text-align: center;">Maaf</h2>
                            <p>Jumlah beli melebihi jumlah ketersediaan produk</p>
                        </div>
                    </div>
                `;

    // Memasukkan modal ke dalam halaman
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mencegah scroll background saat modal ditampilkan
    document.body.style.overflow = "hidden";

    return false; // Mencegah pengiriman formulir
  } else {
    submitDetailBelanja();
    // Jika jumlah_beli valid, kembalikan true untuk melanjutkan pengiriman formulir
    return true;
  }
}

function cekJumlahKeranjang(event) {
  event.preventDefault(); // Mencegah pengiriman formulir secara default

  var jumlah_stok = parseInt(
    document
      .getElementById("jumlah_stok")
      .textContent.replace("Tersisa : ", ""),
    10
  );
  var jumlah_keranjang = parseInt(document.getElementById("jumlah_keranjang").value, 10);

  if (jumlah_keranjang > jumlah_stok) {
    closeModal();
    var modalHTML = `
                    <div id="modal-error" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative;">
                            <span class="close" onclick="closeModal('modal-error')" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                            <h2 style="text-align: center;">Maaf</h2>
                            <p>Jumlah beli melebihi jumlah ketersediaan produk</p>
                        </div>
                    </div>
                `;

    // Memasukkan modal ke dalam halaman
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Mencegah scroll background saat modal ditampilkan
    document.body.style.overflow = "hidden";

    return false; // Mencegah pengiriman formulir
  } else {
    submitKeranjang();
    // Jika jumlah_beli valid, kembalikan true untuk melanjutkan pengiriman formulir
    return true;
  }
}

function closeModalBeli() {
  document.getElementById("modal-beli").style.display = "none";
  document.body.style.overflow = "";
}

function closeModalKeranjang() {
  document.getElementById("modal-keranjang").style.display = "none";
  document.body.style.overflow = "";
}

function closeModal(modalId = "modal") {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.remove();
    document.body.style.overflow = ""; // Mengembalikan scroll saat modal ditutup
  }
}

function submitDetailBelanja() {
  const formData = new FormData(document.getElementById("addDetailBelanja"));

  fetch("../php/tambah_detail_belanja.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Ubah menjadi text jika PHP tidak mengembalikan JSON
    })
    .then((data) => {
      console.log("Response from server:", data);
      if (data.includes("Insert successful")) {
        closeModalBeli(); // Tutup modal jika berhasil
        alert("Pembelian berhasil!"); // Tampilkan pesan sukses
        window.location.href = "../html/home.html"; // Redirect ke halaman utama
      } else {
        alert("Gagal melakukan pembelian, silakan coba lagi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    });
}

function submitKeranjang() {
  const formData = new FormData(document.getElementById("addKeranjang"));

  fetch("../php/tambah_keranjang.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Ubah menjadi text jika PHP tidak mengembalikan JSON
    })
    .then((data) => {
      console.log("Response from server:", data);
      if (data.includes("Insert successful")) {
        closeModalBeli(); // Tutup modal jika berhasil
        alert("Produk telah masuk keranjang!"); // Tampilkan pesan sukses
        window.location.href = "../html/home.html"; // Redirect ke halaman utama
      } else {
        alert("Gagal melakukan pembelian, silakan coba lagi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    });
}

function showAddKeranjang() {
  document.getElementById("modal-keranjang").style.display = "flex";
  document.body.style.overflow = "hidden";
}
// function submitDetailBelanja(event) {
//   event.preventDefault(); // Prevent default form submission

//   // Collect form data
//   const formData = new FormData(document.getElementById("addDetailBelanja"));

//   fetch("../php/tambah_detail_belanja.php", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         // Handle success case
//         closeModal(); // Close modal after successful submission
//         // Optionally, you can redirect or refresh the page here
//       } else {
//         // Handle error case
//         console.error("Error adding store:", data.error);
//         // Optionally, display an error message to the user
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       // Handle network errors or other exceptions
//     });
// }

fetch("../php/get_metode_pembayaran.php")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const select = document.getElementById("metode_pembayaran");
    // Clear existing options
    select.innerHTML =
      '<option value="" disabled selected>Pilih metode pembayaran</option>';
    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id; // Gunakan ID sebagai value
      option.textContent = item.metode_pembayaran; // Tampilkan nama metode
      select.appendChild(option);
    });

    select.addEventListener("change", (event) => {
      const selectedId = event.target.value; // Ambil nilai ID dari option yang dipilih
      console.log("ID metode pembayaran yang dipilih:", selectedId);

      // Update hidden input field for metode_pembayaran_id
      const metodePembayaranIdInput = document.createElement("input");
      metodePembayaranIdInput.type = "hidden";
      metodePembayaranIdInput.name = "metode_pembayaran_id";
      metodePembayaranIdInput.value = selectedId;
      document
        .getElementById("addDetailBelanja")
        .appendChild(metodePembayaranIdInput);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("Gagal memuat metode pembayaran. Silakan coba lagi.");
  });
