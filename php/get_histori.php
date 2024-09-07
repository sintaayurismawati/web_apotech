<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $status = $_GET['status']; 

    // $stmt = $conn->prepare("SELECT * FROM detail_produk WHERE user_id=? ORDER BY created_at DESC");
    $stmt = $conn->prepare("SELECT db.*, 
                                   p.nama_produk, 
                                   p.harga_produk, 
                                   p.image_url,
                                   v.nama_vendor, 
                                   v.kota, 
                                   v.image_profil,
                                   mp.metode_pembayaran
                            FROM detail_belanja db
                            JOIN produk p ON db.produk_id = p.id
                            JOIN vendor v ON p.vendor_id = v.id
                            JOIN metode_pembayaran mp ON  db.metode_pembayaran_id = mp.id
                            WHERE db.user_id = ? AND db.status = ?
                            ORDER BY db.created_at DESC;");
    $stmt->bind_param("is", $user_id, $status);
    $stmt->execute();
    $result = $stmt->get_result();

    $histori = [];
    while ($row = $result->fetch_assoc()) {
        $histori[] = $row;
    }

    echo json_encode($histori);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No histori found']);
}
?>
