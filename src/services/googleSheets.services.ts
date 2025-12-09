import type { Booking } from '@prisma/client';
import axios from 'axios';

interface SheetsAPIResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
};

export async function appendToSheet(booking: Booking, villaName: string): Promise<{ success: boolean; error?: string }> {
    const appsScriptURL = process.env.APPS_SCRIPT_URL;

    if (!appsScriptURL) {
        throw new Error('APPS_SCRIPT_URL not configured !!!');
    };

    const sheetData = {
        id: booking.id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        alternatePhone: booking.alternatePhone,
        villaName: villaName,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        numberOfNights: booking.numberOfNights,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        basePrice: booking.basePrice,
        customPrice: booking.customPrice,
        extraPersonCharge: booking.extraPersonCharge,
        discount: booking.discount,
        subTotalAmount: booking.subTotalAmount,
        isGSTIncluded: booking.isGSTIncluded,
        totalTax: booking.totalTax,
        totalPayableAmount: booking.totalPayableAmount,
        advancePaid: booking.advancePaid,
        dueAmount: booking.dueAmount,
        createdAt: booking.createdAt.toISOString()
    };

    try {
        const response = await axios.post<SheetsAPIResponse>(appsScriptURL, sheetData, { timeout: 10000 });

        if (response.data.success) {
            return {
                success: true
            };
        }
        else {
            return {
                success: false,
                error: response.data.error || 'Unknown error'
            };
        };
    }
    catch (error: any) {
        console.error('Google Sheets sync error:', error.message);
        return {
            success: false,
            error: error.message
        };
    };
};