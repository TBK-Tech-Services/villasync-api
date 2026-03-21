import { Booking_Status, Payment_Status } from '@prisma/client';

export interface Booking_Data {
    guestName: string;
    guestEmail: string | null;
    guestPhone: string;
    alternatePhone: string | null;
    villaId: number;
    checkIn: Date;
    checkOut: Date;
    numberOfAdults: number;
    numberOfChildren: number;
    totalGuests: number;
    numberOfNights: number;
    specialRequest: string | null;
    bookingStatus: Booking_Status;
    paymentStatus: Payment_Status;
    perNightPrice: number | null;
    customPrice: number | null;
    extraPersonCharge: number;
    discount: number;
    agentName: string | null;
    subTotalAmount: number;
    gstMode: string;
    gstOnBasePrice: boolean;
    gstOnExtraCharge: boolean;
    gstDays: number;
    totalTax: number;
    totalPayableAmount: number;
    advancePaid: number;
    dueAmount: number;
    bookingSource: string | null;
}
