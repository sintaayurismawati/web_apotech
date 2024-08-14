<?php
session_start();
include('db_connect.php');

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $user = $result->fetch_assoc();
    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "User not found."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "No session found."]);
}
?>
