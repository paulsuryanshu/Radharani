<?php
session_start();
require 'vendor/autoload.php'; // Include the Google API PHP Client Library

// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'radharani';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Google client setup
$client = new Google_Client();
$client->setClientId('YOUR_GOOGLE_CLIENT_ID');
$client->setClientSecret('YOUR_GOOGLE_CLIENT_SECRET');
$client->setRedirectUri('http://yourdomain.com/callback.php'); // Update with your actual redirect URL
$client->addScope("email");
$client->addScope("profile");

// Process standard email/password login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Input sanitization
    $email = filter_var($_POST['login-email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['login-password'];

    // Check if inputs are valid
    if (empty($email) || empty($password)) {
        echo "Email and password are required!";
        exit();
    }

    // Authenticate user with database
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        // Verify password
        if (password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user['email'];
            header("Location: dashboard.php");
            exit();
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "User not found!";
    }

    $stmt->close();
}

// Handle Google login
if (isset($_GET['code'])) {
    try {
        $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
        if (isset($token['error'])) {
            throw new Exception("Error fetching access token: " . $token['error']);
        }

        $client->setAccessToken($token['access_token']);
        $google_service = new Google_Service_Oauth2($client);
        $google_user = $google_service->userinfo->get();

        // Extract user information
        $google_email = $google_user->email;
        $google_name = $google_user->name;

        // Check if Google user exists in the database
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $google_email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            // Register new Google user
            $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
            // Use a default random password for Google users (optional)
            $random_password = password_hash(uniqid(), PASSWORD_DEFAULT);
            $stmt->bind_param("ss", $google_email, $random_password);
            $stmt->execute();
        }

        // Log in the Google user
        $_SESSION['user'] = $google_email;
        header("Location: dashboard.php");
        exit();

    } catch (Exception $e) {
        echo "Google login failed: " . $e->getMessage();
        exit();
    }
}

// Close the database connection
$conn->close();
?>
