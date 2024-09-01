<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { // Periksa apakah user_id ada di sesi
        $user_id = $_SESSION['user_id'];
        $produk_id = (int) $_POST['produk_id'];

        $stmt = $conn->prepare("INSERT INTO keranjang (user_id, produk_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $produk_id);
        if ($stmt->execute()) {
            echo "Insert successful";
            // header("Location: ../html/home.html?addKeranjang=success");
        } else {
            echo "Insert error: " . $stmt->error;
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
