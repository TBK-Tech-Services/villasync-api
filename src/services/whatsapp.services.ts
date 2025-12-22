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
        // Note: Adjust this based on your actual schema structure
        // If voucher is stored differently, modify accordingly
        const voucherUrl = validatedData.voucherUrl; // From request body

        if (!voucherUrl) {
            throw new Error('Booking voucher PDF URL is required. Please generate voucher first.');
        }

        // 4. Prepare template parameters
        const guestName = booking.guestName;
        const villaName = booking.villa.name;
        const bookingIdDisplay = `#${booking.id}`;

        // Format dates
        const formatDate = (date: Date) => {
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        };

        const checkIn = formatDate(new Date(booking.checkIn));
        const checkOut = formatDate(new Date(booking.checkOut));

        // 5. Get WhatsApp-compatible phone number (without + sign)
        const whatsappNumber = getWhatsAppNumber(formattedPhone);

        // 6. Send WhatsApp message using template
        // Note: Template parameters order must match your Meta template
        const templateParams = [
            guestName,        // {{1}}
            villaName,        // {{2}}
            bookingIdDisplay, // {{3}}
            checkIn,          // {{4}}
            checkOut          // {{5}}
        ];

        const whatsappResponse = await sendTemplateMessage(
            whatsappNumber,
            whatsappConfig.templates.bookingVoucher,
            templateParams
        );

        // 7. Return success response
        return {
            success: true,
            messageId: whatsappResponse.messages?.[0]?.id || 'unknown',
            sentTo: formattedPhone,
            guestName: guestName,
            bookingId: booking.id,
            templateUsed: whatsappConfig.templates.bookingVoucher
        };

    } catch (error: any) {
        console.error('Error in sendVoucherWhatsAppService:', error);
        throw new Error(error.message || 'Failed to send voucher via WhatsApp');
    }
};