<?php
session_start();

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT db.*, 
                                   p.nama_produk, 
                                   p.image_url,
                                   mp.metode_pembayaran,
                                   u.username
                            FROM detail_belanja db
                            JOIN produk p ON db.produk_id = p.id
                            JOIN metode_pembayaran mp ON  db.metode_pembayaran_id = mp.id
                            JOIN users u ON db.user_id = u.id
                            WHERE db.status = 'Selesai' AND p.vendor_id = ?
                            ORDER BY db.created_at DESC;");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $pesanan_masuk = [];
    while ($row = $result->fetch_assoc()) {
        $pesanan_masuk[] = $row;
    }

    echo json_encode($pesanan_masuk);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No order found']);
}
?>
