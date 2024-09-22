<?php
session_start();
include('db_connect.php');

if (isset($_GET['id']) && isset($_SESSION['user_id'])) {
    $prouctId = $_GET['id'];

    // Pastikan admin yang melakukan penghapusan
    if ($_SESSION['user_id'] == 0) { 
        $stmt = $conn->prepare("DELETE FROM produk WHERE id = ?");
        $stmt->bind_param("i", $prouctId);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "Failed to delete product."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["error" => "Unauthorized action."]);
    }

    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request or no session found."]);
}
?>
