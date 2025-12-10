import nodemailer from 'nodemailer';
import { gmailConfig } from '../../config/gmail.config';

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

export async function sendEmailWithPDF(
    to: string,
    subject: string,
    htmlContent: string,
    pdfUrl: string,
    pdfFilename: string
) {
    try {
        // Add download button to email instead of attachment
        const emailWithLink = htmlContent.replace(
            '<p>Please find your booking voucher attached to this email.</p>',
            `<p>Please find your booking voucher below:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="${pdfUrl}" 
                   style="background: #FF6B35; 
                          color: white; 
                          padding: 15px 40px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          display: inline-block;
                          font-weight: bold;
                          font-size: 16px;">
                    📄 Download Voucher PDF
                </a>
            </p>`
        );

        const info = await transporter.sendMail({
            from: `"${gmailConfig.fromName}" <${gmailConfig.user}>`,
            to: to,
            subject: subject,
            html: emailWithLink,
        });

        console.log('Email sent successfully:', info.messageId);

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