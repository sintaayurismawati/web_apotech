<?php
session_start(); // Mulai sesi

include('db_connect.php');

$response = []; // Array untuk menyimpan pesan error dan sukses

if (!$conn) {
    $response['error'] = "Connection failed: " . mysqli_connect_error();
    echo json_encode($response);
    exit(); // Hentikan eksekusi
}

// Pastikan user sudah login
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Ambil data keranjang berdasarkan user_id
    $stmt = $conn->prepare("SELECT * FROM keranjang WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Loop melalui setiap produk dalam keranjang
        while ($row = $result->fetch_assoc()) {
            $produk_id = $row['produk_id']; // Ambil ID produk dari keranjang
            $jumlah_keranjang = $row['jumlah']; // Ambil jumlah produk dalam keranjang

            // Ambil stok produk berdasarkan produk_id
            $stmt_produk = $conn->prepare("SELECT jumlah_stok FROM produk WHERE id = ?");
            $stmt_produk->bind_param("i", $produk_id);
            $stmt_produk->execute();
            $result_produk = $stmt_produk->get_result();

            if ($result_produk->num_rows > 0) {
                $produk = $result_produk->fetch_assoc();
                $jumlah_stok = $produk['jumlah_stok']; // Ambil jumlah stok produk

                // Jika jumlah produk dalam keranjang melebihi jumlah stok, hapus dari keranjang
                if ($jumlah_keranjang > $jumlah_stok) {
                    $stmt_hapus = $conn->prepare("DELETE FROM keranjang WHERE id = ?");
                    $stmt_hapus->bind_param("i", $row['id']);
                    if ($stmt_hapus->execute()) {
                        $response['success'] = "Produk dihapus dari keranjang karena stok tidak mencukupi.";
                    } else {
                        $response['error'] = "Gagal menghapus produk dari keranjang.";
                    }
                }

            } else {
                $response['error'][] = "Produk dengan ID $produk_id tidak ditemukan dalam database.";
            }
        }
    } else {
        $response['message'] = "Keranjang Anda kosong.";
    }
} else {
    $response['message'] = "Anda harus login untuk mengakses keranjang.";
}

$stmt->close();
$conn->close();

// Kembalikan response dalam format JSON
echo json_encode($response);
?>
