<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT * FROM detail_belanja
                            WHERE user_id = ? AND status = 'Dalam Antrian'");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $cekhistori = [];
    $current_time = new DateTime(); // Waktu saat ini
    $current_time->setTimezone(new DateTimeZone('Asia/Jakarta')); // Set timezone sesuai kebutuhan

    while ($row = $result->fetch_assoc()) {
        $created_at = new DateTime($row['created_at']); // Mengambil waktu created_at
        $created_at->setTimezone(new DateTimeZone('Asia/Jakarta')); // Set timezone sesuai kebutuhan

        // Jika lebih dari 1 hari
        $interval = $current_time->diff($created_at);
        if ($interval->days >= 1) {
            // Update status menjadi 'Sedang Diproses'
            $update_stmt = $conn->prepare("UPDATE detail_belanja 
                                           SET status = 'Sedang Diproses' 
                                           WHERE id = ?");
            $update_stmt->bind_param("i", $row['id']);
            $update_stmt->execute();
            $update_stmt->close();

            // Ubah status di array cekhistori
            $row['status'] = 'Sedang Diproses';
        }

        $cekhistori[] = $row;
    }

    echo json_encode($cekhistori);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'No histori found']);
}
?>
