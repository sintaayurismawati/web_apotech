document.addEventListener("DOMContentLoaded", () => {
  getDetailProduk();
});

function getDetailProduk() {
  const selectedProductVendor = JSON.parse(
    localStorage.getItem("selectedProductVendor")
  );
  console.log("produk dipilih : ", selectedProductVendor);
  if (selectedProductVendor) {
    const produk_id = selectedProductVendor.id; // Mengambil produk_id dari localStorage
    console.log("produk id nya : ", produk_id);

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
          // Menampilkan data produk yang diterima dari PHP
          console.log("hasil fetch php : ", data);
          document.getElementById("image_url").src = data.image_url;
          document.getElementById("nama_produk").textContent = data.nama_produk;
          document.getElementById(
            "harga_produk"
          ).textContent = `Rp${data.harga_produk}`;
          document.getElementById(
            "jumlah_stok"
          ).textContent = `Tersisa : ${data.jumlah_stok}`;
          document.getElementById("deskripsi-produk").textContent =
            data.deskripsi;
          document.getElementById("edit_nama_produk").value = data.nama_produk;
          document.getElementById("edit_harga_produk").value =
            data.harga_produk;
          document.getElementById("edit_jumlah_stok").value = data.jumlah_stok;
          document.getElementById("edit_deskripsi").value = data.deskripsi;
          document.getElementById("edit_produk_id").value = data.id;
        }
      })
      .catch((error) => console.error("Error:", error));
  } else {
    alert("No product selected");
  }
}

function showEdit() {
  document.getElementById("modal-edit").style.display = "flex";

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";

  // document.getElementById("editDetailProduk").reset();
}

function closeModal(modal_id, keterangan) {
  document.getElementById(modal_id).remove();
  document.body.style.overflow = "";

  if (keterangan === "Produk berhasil dihapus.") {
    window.location.href = "../html/home.html";
  }
}

function closeModal2(modal_id) {
  document.getElementById(modal_id).style.display = "none";
  document.body.style.overflow = "";

  if (modal_id === "modal-edit") {
    document.getElementById("editDetailProduk").reset();
  }
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
                          <button onclick="closeModal('modal-fail', '${keterangan}')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function submitUpdateForm(event) {
  event.preventDefault(); // Mencegah submit form secara langsung

  // Tampilkan modal konfirmasi
  showModalConfirm(
    event,
    "Apakah Anda yakin ingin menyimpan perubahan?",
    () => {
      // Jika pengguna memilih "Ya", lanjutkan proses simpan
      produkid = document.getElementById("edit_produk_id").value;
      console.log("produk id : ", produkid);

      // Ambil data form
      const formData = new FormData(
        document.getElementById("editDetailProduk")
      );

      // Kirim permintaan ke PHP untuk update data
      fetch("../php/update_detail_produk.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            // Jika berhasil, tampilkan modal sukses
            closeModal("modal-edit", ""); // Tutup modal edit
            getDetailProduk(); // Refresh detail produk
            showModalSuccess("Detail produk berhasil diupdate."); // Tampilkan modal sukses
          } else {
            // Jika ada kesalahan, tampilkan modal gagal
            console.error("Error adding store:", data.error);
            showModalFail("Gagal menyimpan perubahan.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  );
}

function deleteProduct(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById("editDetailProduk"));

  fetch("../php/delete_product.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        showModalSuccess("Produk berhasil dihapus.");
      } else {
        console.error("Error adding store:", data.error);
        showModalFail("Gagal.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    });
}

function showModalConfirm(event, keterangan, callback) {
  event.preventDefault();

  // Modal konfirmasi HTML
  var modalHTML = `
                    <div id="modal-confirm" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                            <p>${keterangan}</p>
                            <div style="display: flex; justify-content: space-around; margin-top: 10px;">
                              <button id="confirm-yes" style="border: none; background: none; color: #007bff; font-size: 16px; cursor: pointer;">Ya</button>
                              <button id="confirm-no" style="border: none; background: none; color: #007bff; font-size: 16px; cursor: pointer;">Tidak</button>
                            </div>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";

  // Event listener untuk tombol "Ya"
  document.getElementById("confirm-yes").addEventListener("click", function () {
    closeModal("modal-confirm", ""); // Menutup modal konfirmasi
    callback(event); // Memanggil callback function untuk melanjutkan proses
  });

  // Event listener untuk tombol "Tidak" untuk menutup modal
  document.getElementById("confirm-no").addEventListener("click", function () {
    closeModal("modal-confirm", ""); // Menutup modal tanpa memanggil callback
  });
}
