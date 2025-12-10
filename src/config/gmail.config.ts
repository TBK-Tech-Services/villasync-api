
export const gmailConfig = {
    user: process.env.GMAIL_USER || '',
    appPassword: process.env.GMAIL_APP_PASSWORD || '',
    fromName: process.env.GMAIL_FROM_NAME || 'TBK Villas',
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
    }
};