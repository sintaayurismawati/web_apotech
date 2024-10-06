<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { 
        $vendor_id = (int) $_GET['vendor_id'];

        $stmt = $conn->prepare("DELETE keranjang
                                FROM keranjang
                                JOIN produk ON keranjang.produk_id = produk.id
                                JOIN vendor ON produk.vendor_id = vendor.id
                                WHERE vendor.id = ?;");
        $stmt->bind_param("i", $vendor_id);
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