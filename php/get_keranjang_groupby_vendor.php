<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $vendor_id = (int) $_GET['vendor_id'];

    // $stmt = $conn->prepare("SELECT * FROM detail_produk WHERE user_id=? ORDER BY created_at DESC");
    $stmt = $conn->prepare("SELECT COUNT(k.jumlah) AS jumlah,
                                   k.produk_id,
                                   p.nama_produk, 
                                   p.harga_produk, 
                                   p.image_url,
                                   v.id AS vendor_id,
                                   v.nama_vendor, 
                                   v.kota, 
                                   v.image_profil
                            FROM keranjang k
                            JOIN produk p ON k.produk_id = p.id
                            JOIN vendor v ON p.vendor_id = v.id
                            WHERE k.user_id = ? AND v.id = ?
                            GROUP BY k.produk_id
                            ORDER BY k.created_at DESC;");
    $stmt->bind_param("ii", $user_id, $vendor_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $keranjang = [];
    while ($row = $result->fetch_assoc()) {
        $keranjang[] = $row;
    }

    echo json_encode($keranjang);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No keranjang found']);
}
?>
