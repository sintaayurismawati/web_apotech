<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $kategori = $_GET['kategori'];  // Perbaiki dari 'ketegoriProduk' ke 'kategori'

    $stmt = $conn->prepare("SELECT p.id, p.vendor_id, p.nama_produk, p.kategori_produk, p.harga_produk, p.jumlah_stok, p.jumlah_terjual, p.deskripsi, p.image_url, v.nama_vendor, v.kota, v.image_profil 
                            FROM produk p 
                            JOIN vendor v ON p.vendor_id = v.id
                            WHERE kategori_produk=? AND p.deleted_at IS NULL;");
    $stmt->bind_param("s", $kategori);
    $stmt->execute();
    $result = $stmt->get_result();

    $produk = [];
    while ($row = $result->fetch_assoc()) {
        $produk[] = $row;
    }

    echo json_encode($produk);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No product found']);
}
?>
