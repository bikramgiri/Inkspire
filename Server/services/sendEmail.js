const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const otpDigits = String(options.otp)
      .split("")
      .map(
        (d) => `
        <span style="
          display: inline-block;
          width: 42px; height: 52px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 26px;
          font-weight: 500;
          line-height: 52px;
          text-align: center;
          color: black;
          font-family: 'Courier New', monospace;
        ">${d}</span>`
      )
      .join("");

    const mailOptions = {
      from: `"Inkspire" <${process.env.EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: `Your Inkspire OTP is: ${options.otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\n— The Inkspire Team`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Inkspire OTP</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e; padding:24px 32px;">
              <span style="color:#a5b4fc; font-size:20px; font-weight:500; letter-spacing:0.04em;">Inkspire</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 6px; font-size:12px; color:#94a3b8; letter-spacing:0.06em; text-transform:uppercase;">Password reset</p>
              <h2 style="margin:0 0 12px; font-size:20px; font-weight:500; color:#1e293b;">Here's your one-time code</h2>
              <p style="margin:0; font-size:15px; color:#64748b; line-height:1.6;">
                Use the code below to reset your password. It expires in <strong style="color:#1e293b; font-weight:500;">10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td style="padding:20px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:24px; text-align:center;">
                    <p style="margin:0 0 14px; font-size:11px; color:#94a3b8; letter-spacing:0.08em; text-transform:uppercase;">Your OTP</p>
                    <div style="display:inline-flex; gap:8px;">
                      ${otpDigits}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9ec; border-radius:8px; border:1px solid #f0d080;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0; font-size:13px; color:#7a5f10; line-height:1.6;">
                      If you didn't request a password reset, you can safely ignore this email. Someone may have typed your email by mistake.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px; border-top:1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px; color:#94a3b8;">The Inkspire Team</td>
                  <td align="right" style="font-size:12px; color:#94a3b8;">inkspire.com</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };