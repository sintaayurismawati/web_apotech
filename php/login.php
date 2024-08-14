login.php :
<?php
// Include database connection file
include('db_connect.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['username'] = $username;
        $_SESSION['user_id'] = $user['id']; // Save user ID to session
        header("Location: ../html/home.html");
    } else {
        echo "Invalid username or password.";
    }
    $stmt->close();
    $conn->close();
}
?>

