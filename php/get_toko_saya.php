<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];;

    $stmt = $conn->prepare("SELECT v.*,
                            (SELECT COUNT(p.id)
                                FROM produk p
                                WHERE p.vendor_id = v.id
                                AND p.deleted_at IS NULL) AS jumlah_produk,
                            (SELECT COUNT(db.id)
                                FROM detail_belanja db
                                JOIN produk p ON db.produk_id = p.id
                                WHERE p.vendor_id = v.id
                                AND db.status = 'Telah Dikirim') AS jumlah_terjual,
                            (SELECT COUNT(k.id)
                                FROM keranjang k
                                JOIN produk p ON k.produk_id = p.id
                                WHERE p.vendor_id = v.id
                                AND p.deleted_at IS NULL) AS jumlah_keranjang
                            FROM vendor v
                            WHERE v.user_id = ?;
                        ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $vendor = $result->fetch_assoc();

    if ($vendor) {
        $_SESSION['vendor_id'] = $vendor['id'];
        echo json_encode($vendor);
    } else {
        echo json_encode(['error' => 'User not found']);
    }

    $stmt->close();
    $conn->close();
}else {
    echo json_encode(['error' => 'User ID not provided']);
}
?>