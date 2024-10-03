<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . mysqli_connect_error()]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { 
        $produk_id = (int) $_POST['edit_produk_id'];

        $stmt = $conn->prepare("UPDATE produk SET 
                                deleted_at = NOW()
                                WHERE id = ?");
        $stmt->bind_param("i", $produk_id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Update successful"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Update error: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        // Jika user_id tidak ada dalam sesi, kembali ke halaman login atau berikan pesan kesalahan
        echo json_encode(["status" => "error", "message" => "User ID not found in session."]);
        header("Location: ../html/login.html");
    }

    mysqli_close($conn);
}
