<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['vendor_id'])) {
    $vendor_id = $_SESSION['vendor_id'];

    $stmt = $conn->prepare("SELECT * FROM produk WHERE vendor_id = ?");
    $stmt->bind_param("i", $vendor_id);
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
    echo json_encode(['error' => 'Vendor ID not provided']);
}
?>
