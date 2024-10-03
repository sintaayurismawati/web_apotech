document.addEventListener("DOMContentLoaded", () => {
  // showDetailProduct();
  getDetailProduk();
});

function getDetailProduk() {
  const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
  console.log("Selected Product:", selectedProduct);
  if (selectedProduct) {
    const produk_id = selectedProduct.id; // Mengambil produk_id dari localStorage

    // AJAX untuk mengirim produk_id ke PHP
    fetch("../php/get_detail_produk.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produk_id: produk_id }), // Mengirim produk_id ke PHP
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error); // Menangani kesalahan dari PHP
          alert("Error fetching product details.");
        } else {
          showUlasan(produk_id);

          document.getElementById("image_url").src = data.image_url;
          document.getElementById("nama_produk").textContent = data.nama_produk;
          document.getElementById(
            "harga_produk"
          ).textContent = `Rp${data.harga_produk}`;
          document.getElementById(
            "jumlah_stok"
          ).textContent = `Tersisa : ${data.jumlah_stok}`;
          document.getElementById("kategori_produk").textContent =
            data.kategori_produk;
          document.getElementById("nama_vendor").textContent = data.nama_vendor;
          document.getElementById("image_profil").src = data.image_profil;

          document.getElementById("kota").textContent = data.kota;
          document.getElementById("deskripsi-produk").textContent =
            data.deskripsi;

          // Add hidden input for produk_id in the form
          const produkIdInput = document.createElement("input");
          produkIdInput.type = "hidden";
          produkIdInput.name = "produk_id";
          produkIdInput.value = produk_id;
          document
            .getElementById("addDetailBelanja")
            .appendChild(produkIdInput);

          const produkIdInput2 = document.createElement("input");
          produkIdInput2.type = "hidden";
          produkIdInput2.name = "produk_id";
          produkIdInput2.value = produk_id;
          document.getElementById("addKeranjang").appendChild(produkIdInput2);

          document
            .getElementById("jumlah_beli")
            .addEventListener("input", () => {
              const jumlahBeli =
                parseInt(document.getElementById("jumlah_beli").value, 10) || 0;
              const hargaProduk = parseInt(data.harga_produk, 10) || 0;
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

          document
            .getElementById("jumlah_keranjang")
            .addEventListener("input", () => {
              const jumlahKeranjang =
                parseInt(
                  document.getElementById("jumlah_keranjang").value,
                  10
                ) || 0;
              const hargaProduk = parseInt(data.harga_produk, 10) || 0;
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
        }
      })
      .catch((error) => console.error("Error:", error));
  } else {
    alert("No product selected");
  }
}

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
    // closeModal();
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

function closeModal(modal_id, keterangan) {
  document.getElementById(modal_id).style.display = "none";
  document.body.style.overflow = "";

  if (keterangan === "Pembelian berhasil!") {
    getDetailProduk();
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
        closeModal("modal-beli"); // Tutup modal jika berhasil
        // alert("Pembelian berhasil!");
        showModalSuccess("Pembelian berhasil!");
        // window.location.href = "../html/home.html"; // Redirect ke halaman utama
      } else {
        showModalFail("Silahkan coba lagi!");
        // alert("Gagal melakukan pembelian, silakan coba lagi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan, silakan coba lagi.");
    });
}

function submitKeranjang() {
  const formData = new FormData(document.getElementById("addDetailBelanja"));

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
        closeModal("modal-beli"); // Tutup modal jika berhasil
        showModalSuccess("Produk telah masuk keranjang!");
      } else {
        showModalFail("Silahkan coba lagi!");
        // alert("Gagal melakukan pembelian, silakan coba lagi.");
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

function showModalSuccess(keterangan) {
  var modalHTML = `
                    <div id="modal-success" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                        <img src="../images/success-icon.png" alt="Success Image" style="max-width: 100px; margin-bottom: 10px;">    
                        <h2>Sukses</h2>
                            <p>${keterangan}</p>
                             <button onclick="closeModal('modal-success', '${keterangan}')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
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

function showUlasan(produk_id) {
  fetch(
    `../php/get_ulasan_produk.php?produk_id=${encodeURIComponent(produk_id)}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Data fetched:", data);

      const listUlasanContainer = document.getElementById(
        "container-list-ulasan"
      );
      while (listUlasanContainer.firstChild) {
        listUlasanContainer.removeChild(listUlasanContainer.firstChild);
      }

      if (!data || data.length == 0) {
        console.log("belum ada ulasan");
        const noDataFound = document.createElement("div");
        noDataFound.className = "ulasan-noDataFound";

        noDataFound.innerHTML = `
          <div style="display: flex; flex-flow: column; justify-content: center; align-items: center;">
          <img
          src="../images/no_data_found.jpeg"
          style="height: 300px; width: 300px; align-items: center;"
          />
          <h4>Belum ada ulasan untuk produk ini.</h4>
          </div>
        `;
        listUlasanContainer.appendChild(noDataFound);
      } else {
        data.forEach((ulasan) => {
          console.log("ulasan :", ulasan);
          const ulasanCard = document.createElement("div");
          ulasanCard.className = "ulasan-card";
          // ulasanCard.id = `ulasan-card-${ulasan.id}`;

          ulasanCard.innerHTML = `
          <div style="display:flex; flex-flow:column;">
            <div>
              <i class="fas fa-user" style="border: 2px solid #000; border-radius: 50%; padding: 5px; margin-right: 8px;"></i>
              <label class="sub-title">${ulasan.username}</label>
            </div>
            <label style="margin-left:40px; margin-right:20px; word-wrap: break-word;">${ulasan.ulasan}</label>
          </div>
          `;
          listUlasanContainer.appendChild(ulasanCard);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
}

function getMetodePembayaran() {
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
}
