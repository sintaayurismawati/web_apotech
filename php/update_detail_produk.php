<?php
session_start();

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
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
        
        if ($stmt === false) {
            echo json_encode(["status" => "error", "message" => "Prepare statement failed: " . $conn->error]);
            exit;
        }

        $stmt->bind_param("siisi", $nama_produk, $harga_produk, $jumlah_stok, $deskripsi, $produk_id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Update successful"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Update error: " . $stmt->error]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['error' => 'Invalid request']);
    }
}
?>
