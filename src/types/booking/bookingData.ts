import { Booking_Status, Payment_Status } from '@prisma/client';

export interface Booking_Data {
    guestName: string;
    guestEmail: string | null;
    guestPhone: string;
    alternatePhone: string | null;
    villaId: number;
    checkIn: Date;
    checkOut: Date;
    totalGuests: number;
    numberOfNights: number;
    specialRequest: string | null;
    bookingStatus: Booking_Status;
    paymentStatus: Payment_Status;
    basePrice: number;
    customPrice: number | null;
    extraPersonCharge: number;
    discount: number;
    subTotalAmount: number;
    isGSTIncluded: boolean;
    totalTax: number;
    totalPayableAmount: number;
    advancePaid: number;
    dueAmount: number;
}