<?php
session_start();

// Hapus semua sesi
session_unset();

// Hancurkan sesi
session_destroy();

// Redirect ke halaman login atau halaman lain setelah logout
header("Location: ../html/login.html");
exit;
?>
