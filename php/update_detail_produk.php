<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . mysqli_connect_error()]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { 
        $produk_id = (int) $_POST['edit_produk_id'];
        $nama_produk = $_POST['edit_nama_produk'];
        $harga_produk = (int) $_POST['edit_harga_produk'];
        $jumlah_stok = (int) $_POST['edit_jumlah_stok'];
        $deskripsi = $_POST['edit_deskripsi'];

        $stmt = $conn->prepare("UPDATE produk SET 
                                nama_produk=?, 
                                harga_produk=?, 
                                jumlah_stok=?, 
                                deskripsi=? 
                                WHERE id = ?");
        $stmt->bind_param("siisi", $nama_produk, $harga_produk, $jumlah_stok, $deskripsi, $produk_id);
        
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
