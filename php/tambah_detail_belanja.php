<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) {
        $user_id = (int) $_SESSION['user_id'];
        $produk_id = (int) $_POST['produk_id']; // Menggunakan produk_id yang dikirim dari form
        $jumlah_beli = (int) $_POST['jumlah_beli'];
        $total = (int) $_POST['total'];
        $metode_pembayaran_id = (int) $_POST['metode_pembayaran_id'];

        $stmt = $conn->prepare("INSERT INTO detail_belanja (produk_id, user_id, jumlah_beli, total, metode_pembayaran_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iiiii", $produk_id, $user_id, $jumlah_beli, $total, $metode_pembayaran_id);
        if ($stmt->execute()) {
            echo "Insert successful";
            // header("Location: ../html/home.html?addStore=success");
        } else {
            echo "Insert error: " . $stmt->error;
            // header("Location: ../html/home.html?addStore=error");
        }
        $stmt->close();

    } else {
        echo "User ID not found in session.";
        // header("Location: ../html/login.html");
    }

    mysqli_close($conn);
}

?>
