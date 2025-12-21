<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set response header
header('Content-Type: application/json');

// Function to send response
function sendResponse($success, $message) {
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Invalid request method');
}

// Validate and sanitize input
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email address is required';
}

if (empty($subject)) {
    $errors[] = 'Subject is required';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

if (!empty($errors)) {
    sendResponse(false, implode(', ', $errors));
}

// Sanitize inputs
$firstName = htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars($lastName, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Map subject value to readable text
$subjectMap = [
    'sales' => 'Sales Inquiry',
    'support' => 'Technical Support',
    'billing' => 'Billing Question',
    'partnership' => 'Partnership Opportunity',
    'other' => 'Other'
];
$subjectText = isset($subjectMap[$subject]) ? $subjectMap[$subject] : $subject;

// Email configuration
$to = 'admin@leytewebhost.com';
$emailSubject = "Contact Form: $subjectText - $firstName $lastName";

// Create email body
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #2563eb; margin-bottom: 5px; }
        .field-value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; }
        .footer { background: #0f172a; color: #94a3b8; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2 style='margin: 0;'>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='field-label'>Name:</div>
                <div class='field-value'>$firstName $lastName</div>
            </div>
            <div class='field'>
                <div class='field-label'>Email:</div>
                <div class='field-value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='field'>
                <div class='field-label'>Phone:</div>
                <div class='field-value'>" . (!empty($phone) ? $phone : 'Not provided') . "</div>
            </div>
            <div class='field'>
                <div class='field-label'>Subject:</div>
                <div class='field-value'>$subjectText</div>
            </div>
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='field-value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This email was sent from the contact form at leytewebhost.com</p>
            <p>Received: " . date('F j, Y, g:i a') . "</p>
        </div>
    </div>
</body>
</html>
";

// Plain text version for email clients that don't support HTML
$emailBodyPlain = "
New Contact Form Submission
============================

Name: $firstName $lastName
Email: $email
Phone: " . (!empty($phone) ? $phone : 'Not provided') . "
Subject: $subjectText

Message:
$message

---
This email was sent from the contact form at leytewebhost.com
Received: " . date('F j, Y, g:i a') . "
";

// Check if PHPMailer is available
if (file_exists('PHPMailer/PHPMailer.php')) {
    // Use PHPMailer
    require_once 'PHPMailer/PHPMailer.php';
    require_once 'PHPMailer/SMTP.php';
    require_once 'PHPMailer/Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.leytewebhost.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'admin@leytewebhost.com';
        $mail->Password = 'g7+Mt9K[xs;p';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Recipients
        $mail->setFrom('admin@leytewebhost.com', 'Leytewebhost Contact Form');
        $mail->addAddress('admin@leytewebhost.com', 'Admin');
        $mail->addReplyTo($email, "$firstName $lastName");

        // Content
        $mail->isHTML(true);
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;
        $mail->AltBody = $emailBodyPlain;

        $mail->send();
        sendResponse(true, 'Thank you for your message! We will get back to you soon.');
    } catch (Exception $e) {
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        sendResponse(false, 'Unable to send message. Please try again later or contact us directly.');
    }
} else {
    // Fallback to PHP mail() with SMTP headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Leytewebhost Contact Form <admin@leytewebhost.com>\r\n";
    $headers .= "Reply-To: $firstName $lastName <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Additional parameters for sendmail
    $params = "-f admin@leytewebhost.com";

    if (mail($to, $emailSubject, $emailBody, $headers, $params)) {
        sendResponse(true, 'Thank you for your message! We will get back to you soon.');
    } else {
        error_log("Mail sending failed");
        sendResponse(false, 'Unable to send message. Please try again later or contact us directly.');
    }
}
?>
