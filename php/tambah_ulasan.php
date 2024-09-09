<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SESSION['user_id'])) { 
        $data = json_decode(file_get_contents('php://input'), true);
        $ulasan = $data['ulasan']; // Mengambil data dari POST
        $id = (int) $data['id'];

        if (!empty($ulasan)) {
            $stmt = $conn->prepare("UPDATE detail_belanja SET ulasan=? WHERE id=?");
            $stmt->bind_param("si", $ulasan, $id);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Update successful"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Update error: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Ulasan tidak boleh kosong."]);
        }
    } else {
        // Jika user_id tidak ada dalam sesi, berikan pesan kesalahan
        echo json_encode(["status" => "error", "message" => "User ID not found in session."]);
    }

    mysqli_close($conn);
}
?>
