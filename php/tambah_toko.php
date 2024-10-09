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
        $no_telp = (int) $_POST['phoneNumber'];

        // Proses upload gambar
        $target_dir = "../apotech_images/"; // Folder penyimpanan
        $image_profil = basename($_FILES["image_profil"]["name"]); // Nama file gambar
        $target_file = $target_dir . $image_profil;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Memindahkan file yang diupload ke folder apotech_images
        if (move_uploaded_file($_FILES["image_profil"]["tmp_name"], $target_file)) {
            echo "File " . htmlspecialchars($image_profil) . " berhasil diupload.";
        } else {
            echo "Maaf, terjadi kesalahan saat mengupload file.";
            exit; // Hentikan eksekusi jika gagal upload
        }

        // Simpan informasi vendor ke database
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
?>
