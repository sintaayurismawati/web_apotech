<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { // Periksa apakah user_id ada di sesi
        $user_id = $_SESSION['user_id'];
        $nama_vendor = $_POST['storeName'];
        $kota = $_POST['city'];
        $alamat = $_POST['address'];
        $image_profil = $_POST['image_profil'];
        $no_telp = (int) $_POST['phoneNumber'];

        // Debugging output
        echo "User ID: " . $user_id . "<br>";
        echo "Nama Vendor: " . $nama_vendor . "<br>";
        echo "Kota: " . $kota . "<br>";
        echo "Alamat: " . $alamat . "<br>";
        echo "Image Profil: " . $image_profil . "<br>";
        echo "Nomor Telepon: " . $no_telp . "<br>";

        $stmt = $conn->prepare("INSERT INTO vendor (user_id, nama_vendor, kota, alamat, image_profil, no_telp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssi", $user_id, $nama_vendor, $kota, $alamat, $image_profil, $no_telp);
        if ($stmt->execute()) {
            echo "Insert successful";
            header("Location: ../html/home.html?addStore=success");
        } else {
            echo "Insert error: " . $stmt->error;
            header("Location: ../html/home.html?addStore=error");
        }

        $stmt->close();
    } else {
        // Jika user_id tidak ada dalam sesi, kembali ke halaman login atau berikan pesan kesalahan
        echo "User ID not found in session.";
        header("Location: ../html/login.html");
    }

    mysqli_close($conn);
}
