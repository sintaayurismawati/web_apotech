<?php
include 'db_connect.php';

// Query untuk mengambil ID dan metode pembayaran
$sql = "SELECT id, metode_pembayaran FROM metode_pembayaran";
$result = $conn->query($sql);

// Array untuk menyimpan metode pembayaran dengan ID
$metodePembayaran = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $metodePembayaran[] = [
            'id' => $row['id'],
            'metode_pembayaran' => $row['metode_pembayaran']
        ];
    }
} else {
    // Jika tidak ada data, kembalikan array kosong
    $metodePembayaran = [];
}

// Tutup koneksi
$conn->close();

// Return array metode pembayaran sebagai JSON
echo json_encode($metodePembayaran);
?>
