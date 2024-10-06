<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT DISTINCT v.id, v.nama_vendor, v.image_profil
                            FROM keranjang k
                            JOIN produk p ON k.produk_id = p.id
                            JOIN vendor v ON p.vendor_id = v.id;");
    $stmt->execute();
    $result = $stmt->get_result();

    $vendor = [];
    while ($row = $result->fetch_assoc()) {
        $vendor[] = $row;
    }

    echo json_encode($vendor);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No vendor found']);
}
?>
