<?php
// Configuration for FTP access
$ftp_server = "ftp.cislink.nl";
$ftp_username = "bluedragon@cislink.nl";
$ftp_userpass = "8DcU632gnvlukUlI,e%H|;E;tgg"; // Consider securing this credential better, e.g., environment variables

// Define allowed file extensions
$allowed_extensions = ['png', 'webp', 'jpg', 'jpeg', 'pdf', 'zip', 'rar'];

// File handling
$local_file = $_FILES['fileToUpload']['tmp_name']; // Temporary stored file on your server
$filename = basename($_FILES['fileToUpload']['name']);
$file_extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION)); // Get file extension

// Check if the file extension is allowed
if (!in_array($file_extension, $allowed_extensions)) {
    die('File upload failed. Invalid file extension.');
}

// Establish an FTP connection
$conn_id = ftp_connect($ftp_server);
if (!$conn_id) {
    die('Could not connect to FTP server.');
}

// Attempt to login
$login_result = ftp_login($conn_id, $ftp_username, $ftp_userpass);
if (!$login_result) {
    ftp_close($conn_id);
    die('FTP login failed.');
}

// Enable passive mode
ftp_pasv($conn_id, true);

// Verify file has been uploaded to the temp directory
if (!file_exists($local_file)) {
    die('File upload failed.');
}

// Attempt to upload the file
if (ftp_put($conn_id, $filename, $local_file, FTP_BINARY)) {
    // Successful upload
    $file_url = "https://cislink.nl/bluedragon/menufoto/" . $filename;
    header("Location: bluedragon-upload.html?uploaded=true&url=" . urlencode($file_url));
} else {
    // Handle upload failure
    echo "There was a problem while uploading $filename";
}

// Always close the FTP connection
ftp_close($conn_id);
?>
