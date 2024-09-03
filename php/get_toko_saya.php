<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];;

    $stmt = $conn->prepare("SELECT v.*,
                            COUNT(DISTINCT p.id) AS jumlah_produk,
                            COUNT(DISTINCT db.id) AS jumlah_terjual,
                            COUNT(DISTINCT k.id) AS jumlah_keranjang
                            FROM vendor v
                            LEFT JOIN produk p ON p.vendor_id = v.id
                            LEFT JOIN detail_belanja db ON db.produk_id = p.id
                            LEFT JOIN keranjang k ON k.produk_id = p.id
                            WHERE v.user_id = ?
                            GROUP BY v.id;");
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