const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });
};

const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // send to yourself
    replyTo: email,             // so you can reply directly to the sender
    subject: `📩 New Message: ${subject || 'No Subject'}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #222;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #27c93f, #1a8f2d); padding: 30px 40px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #000;">
            📬 New Portfolio Message
          </h1>
          <p style="margin: 6px 0 0; color: rgba(0,0,0,0.7); font-size: 14px;">
            Someone reached out through your portfolio
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 36px 40px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; width: 100px; vertical-align: top;">From</td>
              <td style="padding: 10px 0; color: #fff; font-weight: 600; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; vertical-align: top;">Email</td>
              <td style="padding: 10px 0;">
                <a href="mailto:${email}" style="color: #27c93f; text-decoration: none; font-size: 15px;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; vertical-align: top;">Subject</td>
              <td style="padding: 10px 0; color: #fff; font-size: 15px;">${subject || 'No Subject'}</td>
            </tr>
          </table>

          <!-- Message Box -->
          <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-left: 3px solid #27c93f; border-radius: 8px; padding: 20px 24px; margin-top: 8px;">
            <p style="margin: 0 0 8px; color: #888; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Message</p>
            <p style="margin: 0; color: #e0e0e0; line-height: 1.8; font-size: 15px; white-space: pre-wrap;">${message}</p>
          </div>

          <!-- Reply Button -->
          <div style="text-align: center; margin-top: 36px;">
            <a href="mailto:${email}?subject=Re: ${subject || 'Your Message'}" 
               style="display: inline-block; background: #27c93f; color: #000; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px;">
              ↩ Reply to ${name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #111; border-top: 1px solid #222; padding: 20px 40px; text-align: center;">
          <p style="margin: 0; color: #444; font-size: 12px;">
            Sent from your portfolio contact form — ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };
