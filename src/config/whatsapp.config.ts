interface WhatsAppConfig {
    apiUrl: string;
    phoneNumberId: string;
    businessAccountId: string;
    accessToken: string;
    apiVersion: string;
    templates: {
        hello: string;
        bookingVoucher: string;
    };
}

// Validate required environment variables
const requiredEnvVars = [
    'WHATSAPP_API_URL',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_BUSINESS_ACCOUNT_ID',
    'WHATSAPP_ACCESS_TOKEN'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
};

export const whatsappConfig: WhatsAppConfig = {
    apiUrl: process.env.WHATSAPP_API_URL!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v24.0',
    templates: {
        hello: process.env.WHATSAPP_TEMPLATE_HELLO || 'hello_world',
        bookingVoucher: process.env.WHATSAPP_TEMPLATE_BOOKING_VOUCHER || 'booking_voucher_tbk'
    }
};

// DEBUG: Check token validity
console.log('🔍 WhatsApp Config Debug:');
console.log('Token Length:', whatsappConfig.accessToken.length);
console.log('Token Start:', whatsappConfig.accessToken.substring(0, 30));
console.log('Token End:', whatsappConfig.accessToken.substring(whatsappConfig.accessToken.length - 30));
console.log('Phone Number ID:', whatsappConfig.phoneNumberId);