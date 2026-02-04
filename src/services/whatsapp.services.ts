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

        // 5. Prepare template parameters (5 variables)
        const templateParams = [
            booking.guestName,                           // {{1}} Guest Name
            booking.villa?.name || 'TBK Villa',          // {{2}} Villa Name
            `BK${booking.id}`,                           // {{3}} Booking ID
            formatDateForWhatsApp(booking.checkInDate),  // {{4}} Check-in
            formatDateForWhatsApp(booking.checkOutDate)  // {{5}} Check-out
        ];

        console.log('📤 Sending WhatsApp with booking_confirmation_utility:');
        console.log('   To:', whatsappNumber);
        console.log('   Params:', templateParams);

        // 6. Send WhatsApp message
        const whatsappResponse = await sendTemplateMessage(
            whatsappNumber,
            'booking_confirmation_utility',  // ✅ Your approved template
            templateParams
        );

        // 7. Validate response and return success
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
            templateUsed: 'booking_confirmation_utility'
        };
    }
    catch (error: any) {
        console.error('Error in sendVoucherWhatsAppService:', error);
        throw new Error(error.message || 'Failed to send voucher via WhatsApp');
    }
}

// Helper function for date formatting
function formatDateForWhatsApp(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }); // Output: "15 Dec 2025"
}