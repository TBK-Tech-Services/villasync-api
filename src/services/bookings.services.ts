import type { Booking } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { Booking_Data } from "../types/booking/bookingData.ts";
import type { searchAndFilterBookingData } from "../validators/data-validators/booking/searchAndFilterBooking.ts";
import type { updateBookingStatusBodyData } from "../validators/data-validators/booking/updateBookingStatusBody.ts";
import type { updatePaymentStatusBodyData } from "../validators/data-validators/booking/updatePaymentStatusBody.ts";

// Service to check if a booking exist
export async function checkIfBookingExistService(bookingId : number): Promise<Booking | null> {
    try {
        const booking = await prisma.booking.findUnique({
            where : {
                id : bookingId
            }
        });

        return booking;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error checking villa availability : ${message}`);
        throw new Error(`Error checking villa availability : ${message}`);
    }
}

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
        
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error checking villa availability : ${message}`);
        throw new Error(`Error checking villa availability : ${message}`);
    }
}

// Service to check if a villa is available during a duration While Updating a Booking
export async function checkVillaAvailabilityForUpdateService({villaId, checkInDate, checkOutDate, excludeBookingId}: {villaId: number, checkInDate: Date, checkOutDate: Date, excludeBookingId: number}): Promise<boolean> {
    try {
        const villa = await prisma.villa.findUnique({
            where: { id: villaId },
            include: {
                bookings: {
                    where: {
                        bookingStatus: { 
                            in: ['CONFIRMED', 'CHECKED_IN'] 
                        },
                        id: { 
                            not: excludeBookingId 
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
        };

        for (const booking of villa.bookings) {
            const hasOverlap = (checkInDate < booking.checkOut) && (checkOutDate > booking.checkIn);
            if (hasOverlap){
                return false;
            };
        }
        
        return true;
    } 
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error checking villa availability: ${message}`);
        throw new Error(`Error checking villa availability: ${message}`);
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

// Service to Update a Booking
export async function updateBookingService(bookingId: number, updateData: any): Promise<Booking> {
    try {
        const updatedBooking = await prisma.booking.update({
            where: { 
                id: bookingId 
            },
            data: updateData
        });

        return updatedBooking;
    }
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error updating a booking: ${message}`);
        throw new Error(`Error updating a booking: ${message}`);
    }
}

// Service to Update a Booking Status
export async function updateBookingStatusService({bookingId , updatedData}: {bookingId: number , updatedData: updateBookingStatusBodyData}): Promise<Booking | null> {
    try {
        const updatedBooking = await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : updatedData
        });

        return updatedBooking;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error updating booking status of a booking : ${message}`);
        throw new Error(`Error updating booking status of a booking : ${message}`);
    }
}

// Service to Update a Payment Status
export async function updatePaymentStatusService({bookingId , updatedData}: {bookingId: number , updatedData: updatePaymentStatusBodyData}): Promise<Booking | null> {
    try {
        const updatedBooking = await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : updatedData
        });

        return updatedBooking;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error updating payment status of a booking : ${message}`);
        throw new Error(`Error updating payment status of a booking : ${message}`);
    }
}

// Service to Delete a Booking
export async function deleteBookingService(bookingId: number): Promise<Booking> {
    try {
        const deletedBooking = await prisma.booking.delete({
            where : {
                id : bookingId
            }
        });

        return deletedBooking;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error deleting a booking : ${message}`);
        throw new Error(`Error deleting a booking : ${message}`);
    }
}

// Service to get All Bookings
export async function getAllBookingsService(): Promise<Booking[] | null> {
    try {
        const bookings = await prisma.booking.findMany();

        return bookings;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting all bookings : ${message}`);
        throw new Error(`Error getting all bookings : ${message}`);
    }
}

// Service to get All Bookings
export async function getABookingService(bookingId: number): Promise<Booking | null> {
    try {
        const booking = await prisma.booking.findUnique({
            where : {
                id : bookingId
            },
            include : {
                villa: true
            }
        });

        return booking;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting a booking : ${message}`);
        throw new Error(`Error getting a booking : ${message}`);
    }
}

// Service to Search and Filter Bookings
export async function searchAndFilterBookingsService(validatedData: searchAndFilterBookingData): Promise<Booking[] | null> {
    try {
        let where: any = {};

        if (validatedData.searchText && validatedData.searchText.trim()) {
            where.guestName = {
                contains: validatedData.searchText,
            };
        }

        if (validatedData.status && validatedData.status.trim()) {
            where.bookingStatus = validatedData.status;
        }

        const bookings = await prisma.booking.findMany({
            where: where,
            include: {
                villa: true
            }
        });

        return bookings;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error searching and filtering bookings : ${message}`);
        throw new Error(`Error searching and filtering bookings : ${message}`);
    }
}