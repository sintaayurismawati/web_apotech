<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    // $stmt = $conn->prepare("SELECT * FROM produk");
    $stmt = $conn->prepare("SELECT p.*,
                            v.nama_vendor, 
                            v.kota, 
                            v.image_profil 
                            FROM produk p 
                            JOIN vendor v ON p.vendor_id = v.id
                            WHERE p.deleted_at IS NULL;");
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
