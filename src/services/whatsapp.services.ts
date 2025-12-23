import prisma from '../db/DB';
import { formatPhoneNumberE164, getWhatsAppNumber, isValidPhoneNumber } from '../utils/automation/phone';
import { sendTemplateMessage } from '../utils/automation/whatsapp';
import { whatsappConfig } from '../config/whatsapp.config';
import type { sendVoucherWhatsappData } from '../validators/data-validators/automation/whatsapp';

export async function sendVoucherWhatsAppService(
    bookingId: string,
    validatedData: sendVoucherWhatsappData
) {
    try {
        // 1. Validate phone number format
        const formattedPhone = formatPhoneNumberE164(validatedData.phoneNumber);

        if (!formattedPhone || !isValidPhoneNumber(formattedPhone)) {
            throw new Error('Invalid phone number format. Please include country code (e.g., +91 98765 43210)');
        }

        // 2. Fetch booking details with all necessary relations
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
            include: {
                villa: true
            }
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // 3. Check if voucher exists and has PDF URL
        const voucherUrl = validatedData.voucherUrl;

        if (!voucherUrl) {
            throw new Error('Booking voucher PDF URL is required. Please generate voucher first.');
        }

        // 4. Get WhatsApp-compatible phone number (without + sign)
        const whatsappNumber = getWhatsAppNumber(formattedPhone);

        // 5. Send WhatsApp message using hello_world template (FOR DEMO)
        console.log('📤 Sending WhatsApp with hello_world:');
        console.log('   To:', whatsappNumber);
        console.log('   Template:', 'hello_world');

        const whatsappResponse = await sendTemplateMessage(
            whatsappNumber,
            'hello_world',  // ✅ Using hello_world for demo
            []  // ✅ No parameters for hello_world
        );

        // 6. Validate response and return success
        const messageId = whatsappResponse.messages?.[0]?.id;

        if (!messageId) {
            throw new Error('WhatsApp API did not return a valid message ID');
        }

        return {
            success: true,
            messageId: messageId,
            sentTo: formattedPhone,
            guestName: booking.guestName,
            bookingId: booking.id,
            templateUsed: 'hello_world'
        };
    }
    catch (error: any) {
        console.error('Error in sendVoucherWhatsAppService:', error);
        throw new Error(error.message || 'Failed to send voucher via WhatsApp');
    }
};