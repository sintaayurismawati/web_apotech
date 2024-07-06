<?php
include('db_connect.php');

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $no_telp = (int) $_POST['no_telp'];
    $password = $_POST['password'];
    $retype_password = $_POST['retype_password'];
    $gender = $_POST['gender'];
    $alamat = $_POST['alamat'];

    if ($password === $retype_password) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("INSERT INTO users (username, email, no_telp, password, gender, alamat) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssisss", $username, $email, $no_telp, $hashed_password, $gender, $alamat);

        if ($stmt->execute()) {
            header("Location: login.html?signup=success");
        } else {
            header("Location: login.html?signup=error");
        }

        $stmt->close();
    } else {
        header("Location: login.html?signup=nomatch");
    }
    mysqli_close($conn);
}
?>
