<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { 
        // $keranjang_id = (int) $_POST['id'];
        $data = json_decode(file_get_contents('php://input'), true);
        $pesanan_id = (int) $data['id'];

        $stmt = $conn->prepare("UPDATE detail_belanja SET status='Telah Dikirim' WHERE id=?");
        $stmt->bind_param("i", $pesanan_id);
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Update successful"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Update error: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        // Jika user_id tidak ada dalam sesi, kembali ke halaman login atau berikan pesan kesalahan
        echo "User ID not found in session.";
        header("Location: ../html/login.html");
    }

    mysqli_close($conn);
}
#push hari ini