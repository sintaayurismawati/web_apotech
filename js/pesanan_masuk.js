document.addEventListener("DOMContentLoaded", () => {
  loadPesanan();
});

// function loadPesanan() {
//   const pesananContainer = document.getElementById("pesanan-masuk");
//   while (pesananContainer.firstChild) {
//     pesananContainer.removeChild(pesananContainer.firstChild);
//   }
//   // Fetch data dari PHP
//   fetch("../php/get_detail_belanja.php")
//     .then((response) => response.json()) // Mengubah data yang diterima menjadi JSON
//     .then((data) => {
//       data.forEach((pesanan_masuk) => {
//         // Membuat elemen histori-card baru
//         console.log("Pesanan:", pesanan_masuk);
//         const pesananCard = document.createElement("div");
//         pesananCard.className = "pesanan-card";
//         tanggalBeli = formatTanggal(pesanan_masuk.created_at);

//         pesananCard.innerHTML = `
//                     <div class="tanggal-container">
//                         <label style="font-weight: bold; color: #00a69c;">${tanggalBeli}</label>
//                     </div>
//                     <br>
//                     <div style="display: flex; flex-flow: row; width: 100%;">
//                         <div style="width: 300px; height: 250px;">
//                             <img src="${pesanan_masuk.image_url}">
//                         </div>
//                         <div class="details">
//                             <div>
//                                 <label class="sub-title">${pesanan_masuk.nama_produk}</label>
//                                 <label>${pesanan_masuk.jumlah_beli}x</label>
//                             </div>
//                             <div>
//                                 <label class="sub-title">Total</label>
//                                 <label>Rp${pesanan_masuk.total}</label>
//                             </div>
//                             <div>
//                                 <label class="sub-title">Metode Pembayaran</label>
//                                 <label>${pesanan_masuk.metode_pembayaran}</label>
//                             </div>
//                             <div>
//                                 <label class="sub-title">Username</label>
//                                 <label>${pesanan_masuk.username}</label>
//                             </div>
//                             <div>
//                                 <label class="sub-title">Dikirim ke</label>
//                                 <label>${pesanan_masuk.alamat_pengiriman}</label>
//                             </div>
//                             <div style="display: flex; gap: 10px; margin-top: 10px;">
//                         <button class="btn-hps-psn">Batalkan Pesanan</button>
//                         <button class="btn-konfirm-pengiriman">Konfirmasi Telah Dikirim</button>
//                     </div>
//                         </div>
//                     </div>
//                 `;

//         const btnHapusPsn = pesananCard.querySelector(".btn-hps-psn");
//         btnHapusPsn.addEventListener("click", function () {
//           const pesananId = parseInt(pesanan_masuk.id, 10);

//           showModalConfirm(
//             "Apakah anda yakin ingin membatalkan pesanan?",
//             batalkanPesanan(pesananId)
//           );
//         });

//         const btnKonfirmPengiriman = pesananCard.querySelector(
//           ".btn-konfirm-pengiriman"
//         );
//         btnKonfirmPengiriman.addEventListener("click", function () {
//           // const keranjangId = keranjang.id;
//           const pesananId = parseInt(pesanan_masuk.id, 10);

//           showModalConfirm(
//             "Konfirmasi bahwa pesanan telah dikirim.",
//             konfirmasiPengiriman(pesananId)
//           );
//         });

//         // Menambahkan histori-card ke container histori
//         pesananContainer.appendChild(pesananCard);
//       });
//     })
//     .catch((error) => console.error("Error fetching data:", error));
// }

function loadPesanan() {
  const pesananContainer = document.getElementById("pesanan-masuk");
  while (pesananContainer.firstChild) {
    pesananContainer.removeChild(pesananContainer.firstChild);
  }

  // Fetch data dari PHP
  fetch("../php/get_detail_belanja.php")
    .then((response) => response.json()) // Mengubah data yang diterima menjadi JSON
    .then((data) => {
      data.forEach((pesanan_masuk) => {
        // Membuat elemen histori-card baru
        console.log("Pesanan:", pesanan_masuk);
        const pesananCard = document.createElement("div");
        pesananCard.className = "pesanan-card";
        const tanggalBeli = formatTanggal(pesanan_masuk.created_at);

        pesananCard.innerHTML = `
                    <div class="tanggal-container">
                        <label style="font-weight: bold; color: #00a69c;">${tanggalBeli}</label>
                    </div>
                    <br>
                    <div style="display: flex; flex-flow: row; width: 100%;">
                        <div style="width: 300px; height: 250px;">
                            <img src="${pesanan_masuk.image_url}">
                        </div>
                        <div class="details">
                            <div>
                                <label class="sub-title">${pesanan_masuk.nama_produk}</label>
                                <label>${pesanan_masuk.jumlah_beli}x</label>
                            </div>
                            <div>
                                <label class="sub-title">Total</label>
                                <label>Rp${pesanan_masuk.total}</label>
                            </div>
                            <div>
                                <label class="sub-title">Metode Pembayaran</label>
                                <label>${pesanan_masuk.metode_pembayaran}</label>
                            </div>
                            <div>
                                <label class="sub-title">Username</label>
                                <label>${pesanan_masuk.username}</label>
                            </div>
                            <div>
                                <label class="sub-title">Dikirim ke</label>
                                <label>${pesanan_masuk.alamat_pengiriman}</label>
                            </div>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <button class="btn-hps-psn">Batalkan Pesanan</button>
                                <button class="btn-konfirm-pengiriman">Konfirmasi Telah Dikirim</button>
                            </div>
                        </div>
                    </div>
                `;

        const btnHapusPsn = pesananCard.querySelector(".btn-hps-psn");
        btnHapusPsn.addEventListener("click", function () {
          const pesananId = parseInt(pesanan_masuk.id, 10);

          showModalConfirm(
            "Apakah anda yakin ingin membatalkan pesanan?",
            function () {
              batalkanPesanan(pesananId);
            }
          );
        });

        const btnKonfirmPengiriman = pesananCard.querySelector(
          ".btn-konfirm-pengiriman"
        );
        btnKonfirmPengiriman.addEventListener("click", function () {
          const pesananId = parseInt(pesanan_masuk.id, 10);

          showModalConfirm(
            "Konfirmasi bahwa pesanan telah dikirim.",
            function () {
              konfirmasiPengiriman(pesananId);
            }
          );
        });

        // Menambahkan histori-card ke container histori
        pesananContainer.appendChild(pesananCard);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function formatTanggal(tanggal) {
  const optionsTanggal = { weekday: "long", day: "numeric", month: "long" };
  const optionsWaktu = { hour: "2-digit", minute: "2-digit" };

  // Mengubah string tanggal menjadi objek Date
  const date = new Date(tanggal);

  const formattedTanggal = date.toLocaleDateString("id-ID", optionsTanggal);
  const formattedWaktu = date.toLocaleTimeString("id-ID", optionsWaktu);

  return `${formattedTanggal} ${formattedWaktu} WIB`;
}

function closeModal(modal_id) {
  const modal = document.getElementById(modal_id);
  if (modal) {
    modal.remove(); // Menghapus modal dari DOM setelah ditutup
  }
  document.body.style.overflow = "";
}

function showModalSuccess(keterangan) {
  var modalHTML = `
                    <div id="modal-success" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                        <img src="../images/success-icon.png" alt="Success Image" style="max-width: 100px; margin-bottom: 10px;">    
                        <h2>Sukses</h2>
                            <p>${keterangan}</p>
                             <button onclick="closeModal('modal-success'), loadPesanan()" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">OK</button>
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

// function showModalConfirm(keterangan, action) {
//   // pesananIdToDelete = pesananId;

//   var modalHTML = `
//                     <div id="modal-confirm" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
//                         <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
//                             <p>${keterangan}</p>
//                             <div style="display: flex; flex-flow: row;">
//                               <button onclick= ${action} style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Ya</button>
//                               <button onclick="closeModal('modal-confirm')" style="border: none; background: none; color: #007bff; font-size: 16px; margin-top: 10px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">Tidak</button>
//                             </div>
//                         </div>
//                     </div>
//                 `;

//   // Memasukkan modal ke dalam halaman
//   document.body.insertAdjacentHTML("beforeend", modalHTML);

//   // Mencegah scroll background saat modal ditampilkan
//   document.body.style.overflow = "hidden";
// }

function showModalConfirm(keterangan, callback) {
  var modalHTML = `
                    <div id="modal-confirm" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                        <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative; text-align: center;">
                            <p>${keterangan}</p>
                            <div style="display: flex; flex-flow: row; justify-content: space-around; margin-top: 20px;">
                              <button id="confirm-yes" style="border: none; background: none; color: #007bff; font-size: 16px; cursor: pointer;">Ya</button>
                              <button onclick="closeModal('modal-confirm')" style="border: none; background: none; color: #007bff; font-size: 16px; cursor: pointer;">Tidak</button>
                            </div>
                        </div>
                    </div>
                `;

  // Memasukkan modal ke dalam halaman
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Mencegah scroll background saat modal ditampilkan
  document.body.style.overflow = "hidden";

  // Mengikat event listener ke tombol "Ya"
  document.getElementById("confirm-yes").addEventListener("click", function () {
    closeModal("modal-confirm"); // Menutup modal konfirmasi
    callback(); // Menjalankan callback jika "Ya" ditekan
  });
}

function batalkanPesanan(pesananId) {
  fetch("../php/delete_pesanan_vendor.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: pesananId }),
  })
    .then((response) => response.json()) // Ubah ini menjadi .json() untuk parse JSON
    .then((result) => {
      if (result.status === "success") {
        console.log(result.message);
        // pesananCard.remove();
        showModalSuccess("Pesanan telah dibatalkan."); // Tampilkan modal sukses
        // loadPesanan();
      } else {
        console.log(result.message);
        showModalFail("Silahkan coba lagi!"); // Tampilkan modal gagal
      }
    })
    .catch((error) => console.error("Error deleting:", error));
}

function konfirmasiPengiriman(pesananId) {
  fetch("../php/konfirmasi_pengiriman.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: pesananId }),
  })
    .then((response) => response.json()) // Ubah ini menjadi .json() untuk parse JSON
    .then((result) => {
      if (result.status === "success") {
        console.log(result.message);
        // pesananCard.remove();
        showModalSuccess("Pengiriman telah dikonfirmasi."); // Tampilkan modal sukses
        // loadPesanan();
      } else {
        console.log(result.message);
        showModalFail("Silahkan coba lagi!"); // Tampilkan modal gagal
      }
    })
    .catch((error) => console.error("Error :", error));
}
