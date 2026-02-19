# Email Setup Guide (Nodemailer)

This project uses Nodemailer to send emails. Follow this guide to configure email functionality.

## Configuration

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=IZOGRUP <noreply@izogrup.com>
```

### 2. Gmail Setup (Recommended)

If using Gmail, you need to create an **App Password**:

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and your device
4. Copy the generated 16-character password
5. Use this password in `EMAIL_PASSWORD` (not your regular Gmail password)

### 3. Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### Custom SMTP Server
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

## Usage

### Basic Email Sending

```typescript
import { sendEmail } from "@/lib/nodemailer";

await sendEmail({
  to: "recipient@example.com",
  subject: "Hello from IZOGRUP",
  html: "<h1>Welcome!</h1><p>This is a test email.</p>",
});
```

### Pre-built Email Templates

#### 1. Welcome Email
```typescript
import { sendWelcomeEmail } from "@/lib/nodemailer";

await sendWelcomeEmail("user@example.com", "John Doe");
```

#### 2. Contact Form Email
```typescript
import { sendContactFormEmail } from "@/lib/nodemailer";

await sendContactFormEmail({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  subject: "Product Inquiry",
  message: "I'm interested in your products...",
});
```

#### 3. Order Confirmation Email
```typescript
import { sendOrderConfirmationEmail } from "@/lib/nodemailer";

await sendOrderConfirmationEmail({
  to: "customer@example.com",
  name: "John Doe",
  orderNumber: "ORD-12345",
  items: [
    { title: "Product 1", quantity: 2, price: 50.00 },
    { title: "Product 2", quantity: 1, price: 75.00 },
  ],
  total: 175.00,
});
```

### Advanced Options

```typescript
import { sendEmail } from "@/lib/nodemailer";

await sendEmail({
  to: ["recipient1@example.com", "recipient2@example.com"],
  subject: "Multiple Recipients",
  html: "<p>Email content</p>",
  cc: "cc@example.com",
  bcc: "bcc@example.com",
  replyTo: "reply@example.com",
  from: "Custom Name <custom@example.com>",
});
```

## Testing

### Test Email Endpoint

Send a POST request to `/api/test-email`:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test message"
  }'
```

Or use this JavaScript code in browser console:

```javascript
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'your-email@example.com',
    subject: 'Test Email',
    message: 'Testing email functionality'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Available Email Functions

### `sendEmail(options)`
Send a custom email with full control over content.

**Parameters:**
- `to`: string | string[] - Recipient email(s)
- `subject`: string - Email subject
- `html`: string - HTML content (optional)
- `text`: string - Plain text content (optional)
- `from`: string - Sender email (optional, uses EMAIL_FROM by default)
- `replyTo`: string - Reply-to email (optional)
- `cc`: string | string[] - CC recipients (optional)
- `bcc`: string | string[] - BCC recipients (optional)

### `sendWelcomeEmail(to, name)`
Send a welcome email to new users.

### `sendContactFormEmail(data)`
Send contact form submissions to admin.

### `sendOrderConfirmationEmail(data)`
Send order confirmation to customers.

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Make sure you're using an App Password (not regular password) for Gmail
   - Enable "Less secure app access" if using other providers

2. **"Connection timeout"**
   - Check if your hosting provider blocks SMTP ports
   - Try using port 465 with `secure: true`

3. **Emails going to spam**
   - Add SPF and DKIM records to your domain
   - Use a verified sender email address
   - Avoid spam trigger words in subject/content

4. **Rate limiting**
   - Gmail: 500 emails/day for free accounts
   - Consider using a dedicated email service for production

## Production Recommendations

For production environments, consider using:
- **SendGrid** - Reliable and scalable
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly
- **Postmark** - Fast transactional emails

These services offer better deliverability, analytics, and higher sending limits.

## Security Notes

- Never commit `.env` file to version control
- Use App Passwords instead of regular passwords
- Rotate email credentials regularly
- Monitor email sending logs for suspicious activity
- Implement rate limiting on email endpoints

## Support

For issues or questions, contact the development team or refer to:
- Nodemailer Documentation: https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
