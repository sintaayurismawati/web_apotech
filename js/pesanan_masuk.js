document.addEventListener("DOMContentLoaded", () => {
  loadPesanan();
});

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
        tanggalBeli = formatTanggal(pesanan_masuk.created_at);

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
                        <button class="btn-hps-krj">Batalkan Pesanan</button>
                        <button class="btn-beli-krj">Konfirmasi Telah Dikirim</button>
                    </div>
                        </div>
                    </div>
                `;

        const btnHapusKrj = pesananCard.querySelector(".btn-hps-krj");
        btnHapusKrj.addEventListener("click", function () {
          // const keranjangId = keranjang.id;
          const pesananId = parseInt(pesanan_masuk.id, 10);

          fetch("../php/delete_pesanan_vendor.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: pesananId }),
          })
            .then((response) => response.text())
            .then((result) => {
              console.log(result); // Tampilkan hasil dari delete_keranjang.php
              // Hapus keranjangCard dari tampilan jika perlu
              pesananCard.remove();
            })
            .catch((error) => console.error("Error deleting:", error));
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
