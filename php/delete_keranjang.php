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
        $keranjang_id = (int) $data['id'];

        $stmt = $conn->prepare("DELETE FROM keranjang WHERE id=?");
        $stmt->bind_param("i", $keranjang_id);
        if ($stmt->execute()) {
            echo "Delete successful";
            // header("Location: ../html/home.html?addKeranjang=success");
        } else {
            echo "Delete error: " . $stmt->error;
            // header("Location: ../html/home.html?addKeranjang=error");
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