<?php
session_start(); // Mulai sesi

include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];;

    $stmt = $conn->prepare("SELECT * FROM vendor WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $vendor = $result->fetch_assoc();

    if ($vendor) {
        $_SESSION['vendor_id'] = $vendor['id'];
        echo json_encode($vendor);
    } else {
        echo json_encode(['error' => 'User not found']);
    }

    $stmt->close();
    $conn->close();
}else {
    echo json_encode(['error' => 'User ID not provided']);
}
?>