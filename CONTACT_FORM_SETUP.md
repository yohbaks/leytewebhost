# Contact Form Email Setup Instructions

## Overview
The contact form on the website has been configured to send emails to `admin@leytewebhost.com` using SMTP authentication.

## Files Added/Modified

### New Files:
1. **send_email.php** - Main PHP handler for form submissions
2. **install_phpmailer.php** - Optional installer for PHPMailer library
3. **CONTACT_FORM_SETUP.md** - This file

### Modified Files:
1. **contact.html** - Updated form to submit to send_email.php
2. **script.js** - Added AJAX form submission and validation

## Configuration

The email handler is configured with the following SMTP settings:

- **SMTP Server**: smtp.leytewebhost.com
- **SMTP Port**: 465 (SSL)
- **Username**: admin@leytewebhost.com
- **Authentication**: Required

## Setup Instructions

### Option 1: Using PHP's Built-in mail() Function (Default)

The `send_email.php` file will automatically fall back to PHP's built-in `mail()` function if PHPMailer is not available. This works with most hosting environments that have mail configured.

**No additional setup required** - just upload the files to your server.

### Option 2: Using PHPMailer (Recommended for SMTP)

For better reliability with SMTP authentication, install PHPMailer:

#### Method A: Using the installer script
1. Navigate to your website directory
2. Run the installer:
   ```bash
   php install_phpmailer.php
   ```
3. The script will automatically download and set up PHPMailer

#### Method B: Manual Installation
1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer
2. Extract the files
3. Create a `PHPMailer` folder in your website root
4. Copy these files to the PHPMailer folder:
   - PHPMailer.php
   - SMTP.php
   - Exception.php

#### Method C: Using Composer (if available)
```bash
composer require phpmailer/phpmailer
```
Then update the require paths in `send_email.php` to:
```php
require 'vendor/autoload.php';
```

## Testing the Contact Form

1. Open your website: https://leytewebhost.com/contact.html
2. Fill out the contact form with test data
3. Click "Send Message"
4. You should see a success message
5. Check admin@leytewebhost.com for the received email

## Features

### Frontend:
- ✅ AJAX form submission (no page reload)
- ✅ Real-time field validation
- ✅ Loading state during submission
- ✅ Success/error message display
- ✅ Form reset after successful submission
- ✅ Email format validation
- ✅ Required field validation

### Backend:
- ✅ Input sanitization and validation
- ✅ HTML email with professional styling
- ✅ Plain text fallback for email clients
- ✅ Reply-To header set to sender's email
- ✅ SMTP authentication support
- ✅ Fallback to PHP mail() function
- ✅ Error logging
- ✅ JSON response format

## Email Template

Emails are sent with a professional HTML template featuring:
- Company branding and colors
- Organized field display
- Sender information for easy reply
- Timestamp
- Responsive design

## Security Features

- Input sanitization using `htmlspecialchars()`
- Email validation using `FILTER_VALIDATE_EMAIL`
- XSS protection
- SQL injection protection (no database queries)
- CSRF protection (form validation)

## Troubleshooting

### Form submits but no email received:

1. **Check server mail configuration**:
   ```bash
   php -r "mail('your@email.com', 'Test', 'Test message');"
   ```

2. **Check spam folder** - Initial emails may be flagged as spam

3. **Verify SMTP credentials** - Ensure the password is correct in send_email.php

4. **Check server logs**:
   - PHP error log: Usually at `/var/log/php_errors.log`
   - Mail log: Usually at `/var/log/mail.log`

5. **Test with PHPMailer** - Install PHPMailer for more detailed error messages

### JavaScript errors:

1. Open browser console (F12) and check for errors
2. Ensure script.js is loading correctly
3. Verify fetch API is supported (modern browsers)

### SMTP connection issues:

1. Verify firewall allows outbound SMTP (port 465)
2. Check SMTP server is accessible:
   ```bash
   telnet smtp.leytewebhost.com 465
   ```
3. Verify SSL certificate is valid
4. Check SMTP authentication credentials

## Email Deliverability Tips

1. **SPF Record**: Add SPF record to your domain's DNS
   ```
   v=spf1 a mx ip4:YOUR_SERVER_IP ~all
   ```

2. **DKIM**: Configure DKIM signing for your domain

3. **Reverse DNS**: Ensure your server has proper reverse DNS

4. **From Address**: Using admin@leytewebhost.com matches your domain

## Customization

### Change recipient email:
Edit line 78 in `send_email.php`:
```php
$to = 'admin@leytewebhost.com'; // Change this
```

### Modify email template:
Edit the `$emailBody` variable in `send_email.php` (lines 85-134)

### Adjust validation rules:
Modify the validation section in `send_email.php` (lines 36-53)

## Support

For issues or questions about the contact form:
- Check error logs first
- Verify server email configuration
- Test SMTP connectivity
- Review browser console for JavaScript errors

## Version Information

- **PHP Version Required**: 7.4 or higher
- **PHPMailer Version**: 6.9.1 (if using)
- **Browser Support**: All modern browsers with fetch API support
