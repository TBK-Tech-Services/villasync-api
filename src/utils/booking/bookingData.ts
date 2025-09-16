
export interface Booking_Data {
    guestName: string,
    guestEmail: string,
    guestPhone: string,
    villaId: number,
    checkIn: Date,
    checkOut: Date,
    totalGuests: number,
    specialRequest?: string
    subTotalAmount: number,
    isGSTIncluded: boolean,
    totalTax: number,
    totalPayableAmount: number
};