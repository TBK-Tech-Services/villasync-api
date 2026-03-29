import prisma from "../db/DB.ts";
import { callAppsScript } from "../utils/automation/appsScript.ts";

export async function generateVoucherService({ bookingId }: { bookingId: string }) {
    try {
        // Fetch booking with all required relations
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
            include: {
                villa: {
                    include: {
                        caretakers: true,
                        managers: true,
                    }
                },
            }
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Calculate tax percentage
        const taxPercentage = Number(booking.subTotalAmount) > 0
            ? ((Number(booking.totalTax) / Number(booking.subTotalAmount)) * 100).toFixed(2)
            : '0';

        // Pick first caretaker & manager phone (fallback if not assigned)
        const caretakerPhone = booking.villa.caretakers?.[0]?.phone || 'Contact Admin';
        const managerPhone   = booking.villa.managers?.[0]?.phone   || 'Contact Admin';

        // Format booking data for Apps Script
        const bookingData = {
            bookingId:      booking.id.toString(),
            guestName:      booking.guestName,
            guestPhone:     booking.guestPhone,
            guestEmail:     booking.guestEmail || 'N/A',
            numberOfGuests: booking.totalGuests,
            numberOfAdults:   booking.numberOfAdults,    
            numberOfChildren: booking.numberOfChildren,          
            villaName:      booking.villa.name,
            villaLocation:  booking.villa.location,
            checkInDate:    booking.checkIn.toISOString().split('T')[0],
            checkOutDate:   booking.checkOut.toISOString().split('T')[0],
            bookingStatus:  booking.bookingStatus,
            basePrice:      (booking.customPrice ?? 0).toString(),
            extraCharges:   booking.extraPersonCharge.toString(),
            discount:       booking.discount.toString(),
            taxPercentage:  taxPercentage,
            tax:            booking.totalTax.toString(),
            totalAmount:    booking.totalPayableAmount.toString(),
            amountPaid:     booking.advancePaid.toString(),
            balanceDue:     booking.dueAmount.toString(),
            caretakerPhone: caretakerPhone,
            managerPhone:   managerPhone,
        };

        // Call Apps Script to generate PDF
        const voucherResult = await callAppsScript(bookingData);

        return {
            success:     true,
            voucherUrl:  voucherResult.fileUrl,
            fileId:      voucherResult.fileId,
            fileName:    voucherResult.fileName,
            generatedAt: voucherResult.generatedAt,
        };

    } catch (error: any) {
        console.error('Error in generateVoucherService:', error);
        throw new Error(error.message || 'Failed to generate voucher');
    }
}