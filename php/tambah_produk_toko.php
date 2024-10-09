<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['vendor_id'])) { // Periksa apakah vendor_id ada di sesi
        $vendor_id = $_SESSION['vendor_id'];
        $nama_produk = $_POST['nama_produk'];
        $kategori_produk = $_POST['kategori_produk'];
        $harga_produk = (int) $_POST['harga_produk'];
        $jumlah_stok = (int) $_POST['jumlah_stok'];
        $deskripsi = mysqli_real_escape_string($conn, $_POST['deskripsi']);

        // Mengatur direktori tempat gambar akan disimpan
        $targetDir = "C:/xampp/htdocs/web_apotech/apotech_images/"; // Path di file system
        $imageFileType = strtolower(pathinfo($_FILES["image_url"]["name"], PATHINFO_EXTENSION));
        $imageName = basename($_FILES["image_url"]["name"]);
        $targetFilePath = $targetDir . $imageName;

        // Validasi tipe file gambar (opsional)
        $allowedTypes = array('jpg', 'jpeg', 'png', 'gif');
        if (in_array($imageFileType, $allowedTypes)) {
            // Pindahkan file yang diunggah ke direktori tujuan
            if (move_uploaded_file($_FILES["image_url"]["tmp_name"], $targetFilePath)) {
                // Simpan nama file ke database, bukan path lengkapnya
                $image_url = $imageName;

                // Query untuk menyimpan produk ke database
                $stmt = $conn->prepare("INSERT INTO produk (vendor_id, nama_produk, kategori_produk, harga_produk, jumlah_stok, deskripsi, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("issiiss", $vendor_id, $nama_produk, $kategori_produk, $harga_produk, $jumlah_stok, $deskripsi, $image_url);

                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Produk berhasil ditambahkan."]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Gagal menambahkan produk: " . $stmt->error]);
                }

                $stmt->close();
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal mengunggah gambar."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Tipe file tidak didukung. Hanya JPG, JPEG, PNG, dan GIF yang diperbolehkan."]);
        }
    } else {
        // Jika vendor_id tidak ada dalam sesi
        echo json_encode(["status" => "error", "message" => "Vendor ID tidak ditemukan dalam sesi."]);
        header("Location: ../html/login.html");
    }

    mysqli_close($conn);
}
