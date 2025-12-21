<?php
/**
 * PHPMailer Installation Script
 * This script downloads and extracts PHPMailer library
 */

echo "Installing PHPMailer...\n";

$phpmailerUrl = 'https://github.com/PHPMailer/PHPMailer/archive/refs/tags/v6.9.1.zip';
$zipFile = 'phpmailer.zip';
$extractDir = __DIR__;

// Download PHPMailer
echo "Downloading PHPMailer from GitHub...\n";
$zipContent = file_get_contents($phpmailerUrl);

if ($zipContent === false) {
    die("Error: Unable to download PHPMailer\n");
}

file_put_contents($zipFile, $zipContent);
echo "Downloaded successfully!\n";

// Extract ZIP file
echo "Extracting files...\n";
$zip = new ZipArchive();
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($extractDir);
    $zip->close();

    // Rename extracted folder
    $extractedFolder = $extractDir . '/PHPMailer-6.9.1';
    $targetFolder = $extractDir . '/PHPMailer';

    if (file_exists($extractedFolder)) {
        // Copy only necessary files
        if (!file_exists($targetFolder)) {
            mkdir($targetFolder);
        }

        $filesToCopy = ['PHPMailer.php', 'SMTP.php', 'Exception.php', 'OAuth.php', 'POP3.php'];
        foreach ($filesToCopy as $file) {
            $source = $extractedFolder . '/src/' . $file;
            $destination = $targetFolder . '/' . $file;
            if (file_exists($source)) {
                copy($source, $destination);
                echo "Copied: $file\n";
            }
        }

        // Clean up
        deleteDirectory($extractedFolder);
    }

    // Delete ZIP file
    unlink($zipFile);

    echo "PHPMailer installed successfully!\n";
} else {
    die("Error: Unable to extract ZIP file\n");
}

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return;
    }

    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        is_dir($path) ? deleteDirectory($path) : unlink($path);
    }
    rmdir($dir);
}

echo "Installation complete!\n";
?>
