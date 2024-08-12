<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

//vendor_id, nama_produk, kategori_produk, harga_produk, jumlah_stok, jumlah_terjual, deskripsi
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['vendor_id'])) { // Periksa apakah user_id ada di sesi
        $vendor_id = $_SESSION['vendor_id'];
        $nama_produk = $_POST['nama_produk'];
        $kategori_produk = $_POST['kategori_produk'];
        $harga_produk = (int) $_POST['harga_produk'];
        $image_url = $_POST['image_url'];
        $jumlah_stok = (int) $_POST['jumlah_stok'];
        // $deskripsi = $_POST['deskripsi'];
        $deskripsi = mysqli_real_escape_string($conn, $_POST['deskripsi']);

        $stmt = $conn->prepare("INSERT INTO produk (vendor_id, nama_produk, kategori_produk, harga_produk, jumlah_stok, deskripsi, image_url) VALUES (?, ?, ?, ?, ?, ?,?)");
        $stmt->bind_param("issiiss", $vendor_id, $nama_produk, $kategori_produk, $harga_produk, $jumlah_stok, $deskripsi, $image_url);
        if ($stmt->execute()) {
            echo "Insert successful";
            header("Location: ../html/home.html?addProductStore=success");
        } else {
            echo "Insert error: " . $stmt->error;
            header("Location: ../html/home.html?addProductStore=error");
        }

        $stmt->close();
    } else {
        // Jika user_id tidak ada dalam sesi, kembali ke halaman login atau berikan pesan kesalahan
        echo "Vendor ID not found in session.";
        header("Location: ../html/login.html");
    }

    mysqli_close($conn);
}
