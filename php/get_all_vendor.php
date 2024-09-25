<?php
session_start();
include('db_connect.php');

if (isset($_SESSION['user_id'])) {
    $stmt = $conn->prepare("SELECT v.*, u.username 
                            FROM vendor v 
                            JOIN users u ON v.user_id = u.id;");
    $stmt->execute();
    $result = $stmt->get_result();

    $vendor = $result->fetch_all(MYSQLI_ASSOC); // Mengambil semua baris
    if ($vendor) {
        echo json_encode($vendor); // Ubah menjadi JSON yang bisa dibaca di JS
    } else {
        echo json_encode(["error" => "No vendor found."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No session found."]);
}
?>
