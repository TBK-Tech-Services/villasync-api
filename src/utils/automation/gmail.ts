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