import nodemailer from 'nodemailer';
import { gmailConfig } from '../../config/gmail.config.ts';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    host: gmailConfig.smtp.host,
    port: gmailConfig.smtp.port,
    secure: gmailConfig.smtp.secure,
    auth: {
        user: gmailConfig.user,
        pass: gmailConfig.appPassword,
    },
});

export async function sendPasswordResetOtpEmail(to: string, otp: string) {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                            <tr>
                                <td style="background-color:#1a1a2e; padding:32px 40px; text-align:center;">
                                    <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:1px;">TBK Villas</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:40px;">
                                    <h2 style="margin:0 0 12px 0; color:#1a1a2e; font-size:20px; font-weight:600;">Password Reset Request</h2>
                                    <p style="margin:0 0 24px 0; color:#555555; font-size:15px; line-height:1.6;">
                                        We received a request to reset your password. Use the OTP below to proceed. This code is valid for <strong>10 minutes</strong>.
                                    </p>
                                    <div style="background-color:#f0f4ff; border:2px dashed #4a6cf7; border-radius:8px; padding:24px; text-align:center; margin-bottom:24px;">
                                        <p style="margin:0 0 8px 0; color:#888888; font-size:13px; letter-spacing:1px; text-transform:uppercase;">Your OTP Code</p>
                                        <p style="margin:0; color:#1a1a2e; font-size:40px; font-weight:700; letter-spacing:8px;">${otp}</p>
                                    </div>
                                    <p style="margin:0 0 8px 0; color:#888888; font-size:13px; line-height:1.6;">
                                        If you did not request a password reset, please ignore this email. Your account will remain secure.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color:#f9f9f9; padding:20px 40px; text-align:center; border-top:1px solid #eeeeee;">
                                    <p style="margin:0; color:#aaaaaa; font-size:12px;">© ${new Date().getFullYear()} TBK Villas. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"${gmailConfig.fromName}" <${gmailConfig.user}>`,
            to: to,
            subject: "Password Reset OTP - TBK Villas",
            html: htmlContent,
        });

        console.log('Password reset OTP email sent successfully:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
            accepted: info.accepted,
        };
    }
    catch (error: any) {
        console.error('Error sending password reset OTP email:', error);
        throw new Error(`Failed to send password reset OTP email: ${error.message}`);
    }
}

export async function sendEmailWithPDF(
    to: string,
    subject: string,
    htmlContent: string,
    pdfUrl: string,
    pdfFilename: string
) {
    try {
        // Send email with HTML content
        // The download button is already in the HTML template
        const info = await transporter.sendMail({
            from: `"${gmailConfig.fromName}" <${gmailConfig.user}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log('Email sent successfully:', info.messageId);
        console.log('PDF URL included:', pdfUrl);

        return {
            success: true,
            messageId: info.messageId,
            accepted: info.accepted,
        };
    }
    catch (error: any) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}