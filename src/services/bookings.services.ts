import type { Booking } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { Booking_Data } from "../utils/booking/bookingData.ts";

// Service to check if a villa is available during a duration
export async function checkVillaAvailabilityService({villaId, checkInDate, checkOutDate}: {villaId: number, checkInDate: Date, checkOutDate: Date}): Promise<boolean> {
    try {
        const villa = await prisma.villa.findUnique({
            where: {
                id: villaId
            },
            include: {
                bookings: {
                    where: {
                        bookingStatus: {
                            in: ['CONFIRMED', 'CHECKED_IN']
                        }
                    },
                    select: {
                        checkIn: true,
                        checkOut: true,
                        bookingStatus: true
                    }
                }
            }
        });

        if (!villa) {
            return false; 
        }

        for (const booking of villa.bookings) {
            const hasOverlap = (checkInDate < booking.checkOut) && (checkOutDate > booking.checkIn);
            
            if (hasOverlap) {
                return false; 
            }
        }
        
        return true;
        
    } catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error checking villa availability : ${message}`);
        throw new Error(`Error checking villa availability : ${message}`);
    }
}

// Service to Add a Booking
export async function addBookingService(formData : Booking_Data): Promise<Booking> {
    try {
        const booking = await prisma.booking.create({
            data : formData
        });

        return booking;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error adding a booking : ${message}`);
        throw new Error(`Error adding a booking : ${message}`); 
    }
}

// Service to get All Bookings
export async function getAllBookingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
    
// Service to Update a Booking
export async function updateBookingService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Delete a Booking
export async function deleteBookingService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Export Bookings
export async function exportBookingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}