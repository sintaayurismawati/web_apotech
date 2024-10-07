<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) {
        $user_id = (int) $_SESSION['user_id'];

        // Decode the JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        $produk_keranjang = $input['produk_keranjang'];
        $metode_pembayaran_id = (int) $input['metode_pembayaran_id'];
        $alamat = $input['alamat'];

        // Debug: Menampilkan input
        error_log("User ID: $user_id, Produk Keranjang: " . print_r($produk_keranjang, true) . ", Metode Pembayaran ID: $metode_pembayaran_id, Alamat: $alamat");

        foreach ($produk_keranjang as $produk) {
            $produk_id = (int) $produk['produk_id']; // Ensure the ID is cast to int
            $jumlah_beli = (int) $produk['jumlah_beli']; 
            $total = (int) $produk['total'];

            $stmt = $conn->prepare("SELECT jumlah_stok FROM produk WHERE id=?");
            if (!$stmt) {
                die("Prepare failed: (" . $conn->errno . ") " . $conn->error);
            }
            $stmt->bind_param("i", $produk_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $jumlah_stok = (int) $row['jumlah_stok'];

            if ($jumlah_stok >= $jumlah_beli) {
                $jumlah_stok_baru = $jumlah_stok - $jumlah_beli;

                // Mulai transaksi
                $conn->begin_transaction();

                try {
                    // Insert ke tabel detail_belanja
                    $stmt_insert = $conn->prepare("INSERT INTO detail_belanja (produk_id, user_id, jumlah_beli, total, metode_pembayaran_id, alamat_pengiriman) VALUES (?, ?, ?, ?, ?, ?)");
                    if (!$stmt_insert) {
                        throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
                    }
                    $stmt_insert->bind_param("iiiiis", $produk_id, $user_id, $jumlah_beli, $total, $metode_pembayaran_id, $alamat);
                    if (!$stmt_insert->execute()) {
                        throw new Exception("Execute failed: (" . $stmt_insert->errno . ") " . $stmt_insert->error);
                    }

                    // Update jumlah stok
                    $stmt_update_stock = $conn->prepare("UPDATE produk SET jumlah_stok=? WHERE id=?");
                    if (!$stmt_update_stock) {
                        throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
                    }
                    $stmt_update_stock->bind_param("ii", $jumlah_stok_baru, $produk_id);
                    if (!$stmt_update_stock->execute()) {
                        throw new Exception("Execute failed: (" . $stmt_update_stock->errno . ") " . $stmt_update_stock->error);
                    }

                    // Commit transaksi jika semuanya berhasil
                    $conn->commit();
                    echo "Insert successful";
                } catch (Exception $e) {
                    // Rollback jika ada kesalahan
                    $conn->rollback();
                    error_log("Transaction failed: " . $e->getMessage()); // Menyimpan pesan error ke log server
                    echo "Transaction failed: " . $e->getMessage();
                } finally {
                    $stmt_insert->close();
                    $stmt_update_stock->close();
                }
            } else {
                echo "Stok tidak mencukupi. jumlah stok = $jumlah_stok";
            }
        }
        $stmt->close();
    } else {
        echo "User ID not found in session.";
    }

    mysqli_close($conn);
}
?>
