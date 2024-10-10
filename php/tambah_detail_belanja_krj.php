<?php
session_start(); // Mulai sesi

include('db_connect.php'); // Sambungkan ke database

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Include PHPMailer files
require 'C:\xampp\htdocs\PHPMailer-master\PHPMailer-master\src\Exception.php';
require 'C:\xampp\htdocs\PHPMailer-master\PHPMailer-master\src\PHPMailer.php';
require 'C:\xampp\htdocs\PHPMailer-master\PHPMailer-master\src\SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) {
        $user_id = (int)$_SESSION['user_id'];

        // Decode the JSON data
        $input = json_decode(file_get_contents('php://input'), true);
        $produk_keranjang = $input['produk_keranjang'];
        $metode_pembayaran_id = (int)$input['metode_pembayaran_id'];
        $alamat = $input['alamat'];

        // Debug: Menampilkan input
        error_log("User ID: $user_id, Produk Keranjang: " . print_r($produk_keranjang, true) . ", Metode Pembayaran ID: $metode_pembayaran_id, Alamat: $alamat");

        foreach ($produk_keranjang as $produk) {
            $keranjang_id = (int)$produk['keranjang_id'];
            $produk_id = (int)$produk['produk_id'];
            $jumlah_beli = (int)$produk['jumlah_beli'];
            $total = (int)$produk['total'];

            $stmt = $conn->prepare("SELECT jumlah_stok FROM produk WHERE id=?");
            if (!$stmt) {
                die("Prepare failed: (" . $conn->errno . ") " . $conn->error);
            }
            $stmt->bind_param("i", $produk_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $jumlah_stok = (int)$row['jumlah_stok'];

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

                    // Delete dari keranjang setelah insert sukses
                    $stmt_delete = $conn->prepare("DELETE FROM keranjang WHERE id=?");
                    if (!$stmt_delete) {
                        throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
                    }
                    $stmt_delete->bind_param("i", $keranjang_id);
                    if (!$stmt_delete->execute()) {
                        throw new Exception("Execute failed: (" . $stmt_delete->errno . ") " . $stmt_delete->error);
                    }

                    // Commit transaksi jika semuanya berhasil
                    $conn->commit();
                    echo "Insert successful";

                    // **SELECT detail pembelian yang barusan di-insert**
                    $limit = count($produk_keranjang);
                    $stmt_select_detail = $conn->prepare("SELECT db.*, 
                                        p.nama_produk, 
                                        mp.metode_pembayaran,
                                        u.username
                                    FROM detail_belanja db
                                    JOIN produk p ON db.produk_id = p.id
                                    JOIN metode_pembayaran mp ON  db.metode_pembayaran_id = mp.id
                                    JOIN users u ON db.user_id = u.id
                                    WHERE db.user_id = ?
                                    ORDER BY db.id DESC LIMIT ?;"); // Corrected query

                    if (!$stmt_select_detail) {
                        throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
                    }
                    $stmt_select_detail->bind_param("ii", $user_id, $limit);
                    $stmt_select_detail->execute();
                    $result_detail = $stmt_select_detail->get_result();

                    // Ambil detail terakhir
                    $detail_belanja = $result_detail->fetch_assoc();

                    // Buat tabel HTML untuk dikirim via email
                    $email_table = "<h2>Detail Pembelian Anda</h2>";
                    $email_table .= "<h4>Alamat pengiriman : ${detail_belanja['alamat_pengiriman']}</h4>";
                    $email_table .= "<h4>Metode Pembayaran : ${detail_belanja['metode_pembayaran']}</h4>";
                    $email_table .= "<table border='1' cellpadding='10' cellspacing='0'>";
                    $email_table .= "<tr><th>Nama Produk</th><th>Jumlah Beli</th><th>Total</th></tr>";

                    // Looping untuk menampilkan detail pembelian
                    do {
                        $email_table .= "<tr>";
                        $email_table .= "<td>" . $detail_belanja['nama_produk'] . "</td>";
                        $email_table .= "<td>" . $detail_belanja['jumlah_beli'] . "</td>";
                        $email_table .= "<td>" . $detail_belanja['total'] . "</td>";
                        $email_table .= "</tr>";
                    } while ($detail_belanja = $result_detail->fetch_assoc());

                    $email_table .= "</table>";

                    // **Send email notification**
                    $email = $_SESSION['email']; // Get the email from session
                    $mail = new PHPMailer(true); // Buat instance PHPMailer
                    try {
                        // Konfigurasi SMTP
                        $mail->isSMTP(); // Set mailer to use SMTP
                        $mail->Host = 'smtp.gmail.com'; // Specify main and backup SMTP servers
                        $mail->SMTPAuth = true; // Enable SMTP authentication
                        $mail->Username = 'ssaarrrrmmwwtt@gmail.com'; // SMTP username
                        $mail->Password = 'pxkx qixz rxmv xefq'; // App password Gmail
                        $mail->SMTPSecure = 'ssl'; // Enable SSL encryption
                        $mail->Port = 465; // TCP port to connect to

                        // Nonaktifkan verifikasi sertifikat SSL (untuk pengembangan saja)
                        $mail->SMTPOptions = array(
                            'ssl' => array(
                                'verify_peer' => false,
                                'verify_peer_name' => false,
                                'allow_self_signed' => true
                            )
                        );

                        // Penerima dan pengirim email
                        $mail->setFrom('ssaarrrrmmwwtt@gmail.com', 'ApoTech'); // Pengirim email
                        $mail->addAddress($email); // Penerima email dari session

                        // Isi email
                        $mail->isHTML(true); // Set email format to HTML
                        $mail->Subject = 'Order Confirmation'; // Subjek email
                        $mail->Body = 'Your order has been placed successfully. Thank you for shopping with us!<br>' . $email_table; // Isi email dengan tabel
                        $mail->AltBody = 'Your order has been placed successfully. Thank you for shopping with us!'; // Isi email alternatif

                        // Kirim email
                        $mail->send();
                        error_log("Email sent successfully to $email.");
                    } catch (Exception $e) {
                        error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
                    }

                } catch (Exception $e) {
                    // Rollback jika ada kesalahan
                    $conn->rollback();
                    error_log("Transaction failed: " . $e->getMessage()); // Menyimpan pesan error ke log server
                    echo "Transaction failed: " . $e->getMessage();
                } finally {
                    $stmt_insert->close();
                    $stmt_update_stock->close();
                    $stmt_select_detail->close();
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
