import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send contact form data to your email
 */
export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  surname?: string;
  city?: string;
  province?: string;
  subject: string;
  message: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Your email where you want to receive contact form submissions
    subject: `Contact Form: ${data.subject}`,
    replyTo: data.email,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #9F001B, #1B2556); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">New Contact Form Submission</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Name:</strong>
            <div style="margin-top: 5px;">${data.name}${data.surname ? ` ${data.surname}` : ""}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Email:</strong>
            <div style="margin-top: 5px;">${data.email}</div>
          </div>
          ${data.phone ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Phone:</strong>
            <div style="margin-top: 5px;">${data.phone}</div>
          </div>
          ` : ''}
          ${data.city ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">City:</strong>
            <div style="margin-top: 5px;">${data.city}</div>
          </div>
          ` : ''}
          ${data.province ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Province:</strong>
            <div style="margin-top: 5px;">${data.province}</div>
          </div>
          ` : ''}
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Subject:</strong>
            <div style="margin-top: 5px;">${data.subject}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Message:</strong>
            <div style="margin-top: 5px; white-space: pre-wrap;">${data.message}</div>
          </div>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}

/**
 * Send consumption calculation data to your email
 */
export async function sendConsumptionCalculationEmail(data: {
  productName?: string;
  serviceName?: string;
  tileLength: string;
  tileWidth: string;
  tileThickness: string;
  areaToCover: string;
  groutLength: string;
  userEmail?: string;
  userName?: string;
}) {
  const type = data.productName ? 'Product' : 'Service';
  const name = data.productName || data.serviceName || 'Unknown';
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Consumption Calculation Request - ${name}`,
    replyTo: data.userEmail,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #9F001B, #1B2556); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">Consumption Calculation Request</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">${type}:</strong>
            <div style="margin-top: 5px;">${name}</div>
          </div>
          ${data.userName ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">User Name:</strong>
            <div style="margin-top: 5px;">${data.userName}</div>
          </div>
          ` : ''}
          ${data.userEmail ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">User Email:</strong>
            <div style="margin-top: 5px;">${data.userEmail}</div>
          </div>
          ` : ''}
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Tile Length:</strong>
            <div style="margin-top: 5px;">${data.tileLength} mm</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Tile Width:</strong>
            <div style="margin-top: 5px;">${data.tileWidth} mm</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Tile Thickness:</strong>
            <div style="margin-top: 5px;">${data.tileThickness} mm</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Area To Be Covered:</strong>
            <div style="margin-top: 5px;">${data.areaToCover} M²</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #1B2556;">Grout Length:</strong>
            <div style="margin-top: 5px;">${data.groutLength} mm</div>
          </div>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}
