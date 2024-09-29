<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    // $stmt = $conn->prepare("SELECT * FROM produk");
    $produk_id = (int) $_GET['produk_id']; 

    $stmt = $conn->prepare("SELECT db.ulasan, u.username 
                            FROM detail_belanja db 
                            JOIN users u ON db.user_id = u.id 
                            WHERE produk_id=?
                            AND db.ulasan IS NOT NULL");
    $stmt->bind_param("i", $produk_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $ulasan = [];
    while ($row = $result->fetch_assoc()) {
        $ulasan[] = $row;
    }

    echo json_encode($ulasan);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No ulasan found']);
}
?>
