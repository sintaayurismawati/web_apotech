<?php
// Include database connection file
include('db_connect.php');
session_start();

header('Content-Type: application/json'); // Pastikan response berupa JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username == 'admin' && $password == 'admin') {
        $_SESSION['user_id'] = 0;
        echo json_encode(['status' => 'success', 'redirect' => '../admin/admin.html']);
    } else {
        // Prepare statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            $_SESSION['user_id'] = $user['id']; // Save user ID to session
            $_SESSION['email'] = $user['email'];

            echo json_encode(['status' => 'success', 'redirect' => '../html/home.html']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
        }
        $stmt->close();
        $conn->close();
    }
}
?>
