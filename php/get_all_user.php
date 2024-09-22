<?php
session_start();
include('db_connect.php');

if (isset($_SESSION['user_id'])) {
    $stmt = $conn->prepare("SELECT * FROM users");
    $stmt->execute();
    $result = $stmt->get_result();

    $users = $result->fetch_all(MYSQLI_ASSOC); // Mengambil semua baris
    if ($users) {
        echo json_encode($users); // Ubah menjadi JSON yang bisa dibaca di JS
    } else {
        echo json_encode(["error" => "No users found."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No session found."]);
}
?>
