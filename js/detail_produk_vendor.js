document.addEventListener("DOMContentLoaded", () => {
  const selectedProductVendor = JSON.parse(
    localStorage.getItem("selectedProductVendor")
  );
  console.log(
    "Selected Product Vendor from localStorage:",
    selectedProductVendor
  );

  if (selectedProductVendor) {
    document.getElementById("image_url").src = selectedProductVendor.image_url;
    document.getElementById("nama_produk").textContent =
      selectedProductVendor.nama_produk;
    document.getElementById(
      "harga_produk"
    ).textContent = `Rp${selectedProductVendor.harga_produk}`;
    document.getElementById(
      "jumlah_stok"
    ).textContent = `Tersisa : ${selectedProductVendor.jumlah_stok}`;
    document.getElementById("deskripsi-produk").textContent =
      selectedProductVendor.deskripsi;

    const produkIdInput = document.createElement("input");
    produkIdInput.type = "hidden";
    produkIdInput.name = "produk_id";
    produkIdInput.value = selectedProductVendor.id;
    document.getElementById("addDetailBelanja").appendChild(produkIdInput);

    const produkIdInput2 = document.createElement("input");
    produkIdInput2.type = "hidden";
    produkIdInput2.name = "produk_id";
    produkIdInput2.value = selectedProductVendor.id;
    document.getElementById("addKeranjang").appendChild(produkIdInput2);
  } else {
    alert("No product selected");
  }
});

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
