import type { Booking_Dates } from "../../types/booking/bookingDates.ts";

// Helper to Parse Booking Dates
export function parseBookingDates(checkIn: string, checkOut: string): Booking_Dates {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new Error("Invalid date format !!!");
  }

  return {
    checkInDate,
    checkOutDate
  }
} 