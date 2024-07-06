document.addEventListener('DOMContentLoaded', () => {
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    if (selectedProduct) {
        document.getElementById('image_url').src = selectedProduct.image_url;
        document.getElementById('nama_produk').textContent = selectedProduct.nama_produk;
        document.getElementById('harga_produk').textContent = `Rp${selectedProduct.harga_produk}`;
        document.getElementById('jumlah_stok').textContent = `Tersisa : ${selectedProduct.jumlah_stok}`
        document.getElementById('kategori_produk').textContent = selectedProduct.kategori_produk
        document.getElementById('nama_vendor').textContent = selectedProduct.nama_vendor;
        document.getElementById('image_profil').src = selectedProduct.image_profil;

        document.getElementById('kota').textContent = selectedProduct.kota;
        document.getElementById('deskripsi-produk').textContent = selectedProduct.deskripsi;
    } else {
        alert('No product selected');
    }
});

function showAddDetailBelanja() {
    // Menampilkan popup modal
    var modalHTML = `
                <div id="modal" class="modal" style="display: flex; justify-content: center; align-items: center; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
                    <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 50%; max-width: 300px; border-radius: 10px; position: relative;">
                        <span class="close" onclick="closeModal()" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>
                        <h2 style="text-align: center;">Jumlah</h2>
                        <form id="addDetailBelanja" onsubmit="cekJumlahBeli(event)">
                            <input type="number" id="jumlah_beli" name="jumlah_beli" required style="width: 95%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
                            <input type="submit" value="Lanjut" style="background-color: #00A69C; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        </form>
                    </div>
                </div>
            `;

    // Memasukkan modal ke dalam halaman
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mencegah scroll background saat modal ditampilkan
    document.body.style.overflow = 'hidden';
}

function cekJumlahBeli(event) {
    event.preventDefault(); // Mencegah pengiriman formulir secara default

    var jumlah_stok = parseInt(document.getElementById('jumlah_stok').textContent.replace('Tersisa : ', ''), 10);
    var jumlah_beli = parseInt(document.getElementById('jumlah_beli').value, 10);

    if (jumlah_beli > jumlah_stok) {
        closeModal('modal');
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
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Mencegah scroll background saat modal ditampilkan
        document.body.style.overflow = 'hidden';

        return false; // Mencegah pengiriman formulir
    }

    // Jika jumlah_beli valid, kembalikan true untuk melanjutkan pengiriman formulir
    return true;
}

function closeModal(modalId = 'modal') {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Mengembalikan scroll saat modal ditutup
    }
}

// function closeFirstModal(modalId = 'modal') {
//     var modal = document.getElementById(modalId);
//     if (modal) {
//         modal.remove();
//         document.body.style.overflow = '';
//     }
// }
