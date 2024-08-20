<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) {
        $user_id = (int) $_SESSION['user_id'];
        $produk_id = (int) $_POST['produk_id'];
        $jumlah_beli = (int) $_POST['jumlah_beli'];
        $total = (int) $_POST['total'];
        $metode_pembayaran_id = (int) $_POST['metode_pembayaran_id'];

        // Debug: Menampilkan input
        error_log("User ID: $user_id, Produk ID: $produk_id, Jumlah Beli: $jumlah_beli, Total: $total, Metode Pembayaran ID: $metode_pembayaran_id");

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
                $stmt_insert = $conn->prepare("INSERT INTO detail_belanja (produk_id, user_id, jumlah_beli, total, metode_pembayaran_id) VALUES (?, ?, ?, ?, ?)");
                if (!$stmt_insert) {
                    throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
                }
                $stmt_insert->bind_param("iiiii", $produk_id, $user_id, $jumlah_beli, $total, $metode_pembayaran_id);
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
            echo "Stok tidak mencukupi.";
        }

        $stmt->close();
    } else {
        echo "User ID not found in session.";
    }

    mysqli_close($conn);
}
?>
