<?php
session_start();

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Menerima data yang dikirim dari AJAX
$input = json_decode(file_get_contents("php://input"), true);
$produk_id = $input['produk_id'] ?? null;

if (isset($_SESSION['user_id']) && $produk_id !== null) {
    $stmt = $conn->prepare("SELECT * FROM produk WHERE id = ?");
    $stmt->bind_param("i", $produk_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Mengambil hanya satu produk
    if ($row = $result->fetch_assoc()) {
        echo json_encode($row); // Mengirim satu objek produk
    } else {
        echo json_encode(['error' => 'No product found']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request']);
}
?>
