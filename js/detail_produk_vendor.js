// document.addEventListener("DOMContentLoaded", () => {
//   const selectedProductVendor = JSON.parse(
//     localStorage.getItem("selectedProductVendor")
//   );
//   console.log(
//     "Selected Product Vendor from localStorage:",
//     selectedProductVendor
//   );

//   if (selectedProductVendor) {
//     document.getElementById("image_url").src = selectedProductVendor.image_url;
//     document.getElementById("nama_produk").textContent =
//       selectedProductVendor.nama_produk;
//     document.getElementById(
//       "harga_produk"
//     ).textContent = `Rp${selectedProductVendor.harga_produk}`;
//     document.getElementById(
//       "jumlah_stok"
//     ).textContent = `Tersisa : ${selectedProductVendor.jumlah_stok}`;
//     document.getElementById("deskripsi-produk").textContent =
//       selectedProductVendor.deskripsi;

//     const produkIdInput = document.createElement("input");
//     produkIdInput.type = "hidden";
//     produkIdInput.name = "produk_id";
//     produkIdInput.value = selectedProductVendor.id;
//     document.getElementById("addDetailBelanja").appendChild(produkIdInput);

//     const produkIdInput2 = document.createElement("input");
//     produkIdInput2.type = "hidden";
//     produkIdInput2.name = "produk_id";
//     produkIdInput2.value = selectedProductVendor.id;
//     document.getElementById("addKeranjang").appendChild(produkIdInput2);
//   } else {
//     alert("No product selected");
//   }
// });

document.addEventListener("DOMContentLoaded", () => {
  getDetailProduk();
});

function getDetailProduk() {
  const selectedProductVendor = JSON.parse(
    localStorage.getItem("selectedProductVendor")
  );
  if (selectedProductVendor) {
    const produk_id = selectedProductVendor.id; // Mengambil produk_id dari localStorage

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
          console.log(data);
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

// function updateDetailProduk() {
//   const selectedProductVendor = JSON.parse(
//     localStorage.getItem("selectedProductVendor")
//   );
//   if (selectedProductVendor) {
//     const produk_id = selectedProductVendor.id; // Mengambil produk_id dari localStorage
//     console.log("Produk ID:", produk_id);
//     // AJAX untuk mengirim produk_id ke PHP
//     fetch("../php/update_detail_produk.php", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ produk_id: produk_id }), // Mengirim produk_id ke PHP
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           console.error(data.error); // Menangani kesalahan dari PHP
//           alert("Error fetching product details.");
//         } else {
//           console.log(data);
//         }
//       })
//       .catch((error) => console.error("Error:", error));
//   } else {
//     alert("No product selected");
//   }
// }

function showEdit() {
  document.getElementById("modal-edit").style.display = "flex";

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";
}

function closeModal(modal_id) {
  document.getElementById(modal_id).style.display = "none";
  document.body.style.overflow = "";

  if (modal_id === "modal-success") {
    window.location.href = "../html/home.html";
  }
}

function showModalSuccess(keterangan) {
  var modalHTML = `
                    <div id="modal-success" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                        <img src="../images/success-icon.png" alt="Success Image" style="max-width: 100px; margin-bottom: 10px;">    
                        <h2>Sukses</h2>
                            <p>${keterangan}</p>
                             <button onclick="closeModal('modal-success')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
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
