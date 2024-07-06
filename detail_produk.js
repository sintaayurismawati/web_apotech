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