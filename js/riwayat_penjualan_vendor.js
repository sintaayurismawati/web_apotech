document.addEventListener("DOMContentLoaded", function () {
  fetch("../php/get_riwayat_penjualan.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const tableBody = document.querySelector("#riwayat-table tbody");
        data.forEach((item) => {
          const row = document.createElement("tr");

          // Kolom Tanggal Pembelian
          const cellTanggal = document.createElement("td");
          cellTanggal.textContent = new Date(
            item.created_at
          ).toLocaleDateString();
          row.appendChild(cellTanggal);

          // Kolom Username
          const cellUsername = document.createElement("td");
          cellUsername.textContent = item.username;
          row.appendChild(cellUsername);

          // Kolom Nama Produk
          const cellNamaProduk = document.createElement("td");
          cellNamaProduk.textContent = item.nama_produk;
          row.appendChild(cellNamaProduk);

          // Kolom Jumlah
          const cellJumlah = document.createElement("td");
          cellJumlah.textContent = item.jumlah_beli;
          row.appendChild(cellJumlah);

          // Kolom Total
          const cellTotal = document.createElement("td");
          cellTotal.textContent = item.total;
          row.appendChild(cellTotal);

          // Kolom Metode Pembayaran
          const cellMetodePembayaran = document.createElement("td");
          cellMetodePembayaran.textContent = item.metode_pembayaran;
          row.appendChild(cellMetodePembayaran);

          tableBody.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
})
;
