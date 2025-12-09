import type { Booking } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { Booking_Data } from "../types/booking/bookingData.ts";
import type { searchAndFilterBookingData } from "../validators/data-validators/booking/searchAndFilterBooking.ts";
import type { updateBookingStatusBodyData } from "../validators/data-validators/booking/updateBookingStatusBody.ts";
import type { updatePaymentStatusBodyData } from "../validators/data-validators/booking/updatePaymentStatusBody.ts";
import { NotFoundError, InternalServerError, ConflictError } from "../utils/errors/customErrors.ts";
import { appendToSheet } from "./googleSheets.services.ts";

// Service to check if a booking exist
export async function checkIfBookingExistService(bookingId: number): Promise<Booking | null> {
    try {
        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        });

        return booking;
    }
    catch (error) {
        console.error(`Error checking booking existence: ${error}`);
        throw new InternalServerError("Failed to verify booking existence");
    }
}

// Service to check if a villa is available during a duration
export async function checkVillaAvailabilityService({ villaId, checkInDate, checkOutDate }: { villaId: number, checkInDate: Date, checkOutDate: Date }): Promise<boolean> {
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
        console.error(`Error checking villa availability: ${error}`);
        throw new InternalServerError("Failed to check villa availability");
    }
};

// Service to check if a villa is available during a duration While Updating a Booking
export async function checkVillaAvailabilityForUpdateService({ villaId, checkInDate, checkOutDate, excludeBookingId }: { villaId: number, checkInDate: Date, checkOutDate: Date, excludeBookingId: number }): Promise<boolean> {
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
        console.error(`Error checking villa availability for update: ${error}`);
        throw new InternalServerError("Failed to check villa availability for update");
    }
}

// Service to Add a Booking
export async function addBookingService(formData: Booking_Data): Promise<Booking> {
    try {
        const booking = await prisma.booking.create({
            data: formData
        });

        return booking;
    }
    catch (error) {
        console.error(`Error creating booking: ${error}`);
        throw new InternalServerError("Failed to create booking");
    }
};

// Service for Transaction-based availability check
export async function checkVillaAvailabilityWithTx(tx: any, villaId: number, checkIn: Date, checkOut: Date): Promise<boolean> {
    const villa = await tx.villa.findUnique({
        where: { id: villaId },
        include: {
            bookings: {
                where: {
                    bookingStatus: { in: ['CONFIRMED', 'CHECKED_IN'] }
                },
                select: {
                    checkIn: true,
                    checkOut: true
                }
            }
        }
    });

    if (!villa) {
        return false;
    }

    for (const booking of villa.bookings) {
        const hasOverlap = (checkIn < booking.checkOut) && (checkOut > booking.checkIn);
        if (hasOverlap) {
            return false;
        }
    }

    return true;
}

// Service to Create Booking with Google Sheets Sync
export async function createBookingWithSheetSync(bookingData: Booking_Data, villaName: string): Promise<Booking> {
    try {
        const booking = await prisma.$transaction(async (tx) => {
            const isAvailable = await checkVillaAvailabilityWithTx(
                tx,
                bookingData.villaId,
                bookingData.checkIn,
                bookingData.checkOut
            );

            if (!isAvailable) {
                throw new ConflictError("Villa is not available for the selected dates");
            };

            const newBooking = await tx.booking.create({
                data: bookingData
            });

            const sheetsResult = await appendToSheet(newBooking, villaName);

            if (!sheetsResult.success) {
                throw new Error(`Failed to sync with Google Sheets: ${sheetsResult.error}`);
            };

            return newBooking;
        }, {
            timeout: 15000
        });

        return booking;
    }
    catch (error: any) {
        console.error(`Error creating booking with Sheets sync: ${error}`);
        throw new InternalServerError(error.message || "Failed to create booking");
    };
};

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
        if (error.code === 'P2025') {
            throw new NotFoundError("Booking not found");
        }

        console.error(`Error updating booking: ${error}`);
        throw new InternalServerError("Failed to update booking");
    }
}

// Service to Update a Booking Status
export async function updateBookingStatusService({ bookingId, updatedData }: { bookingId: number, updatedData: updateBookingStatusBodyData }): Promise<Booking | null> {
    try {
        const updatedBooking = await prisma.booking.update({
            where: {
                id: bookingId
            },
            data: updatedData
        });

        return updatedBooking;
    }
    catch (error) {
        // Check if booking doesn't exist
        if (error.code === 'P2025') {
            throw new NotFoundError("Booking not found");
        }

        console.error(`Error updating booking status: ${error}`);
        throw new InternalServerError("Failed to update booking status");
    }
}

// Service to Update a Payment Status
export async function updatePaymentStatusService({ bookingId, updatedData }: { bookingId: number, updatedData: updatePaymentStatusBodyData }): Promise<Booking | null> {
    try {
        const updatedBooking = await prisma.booking.update({
            where: {
                id: bookingId
            },
            data: updatedData
        });

        return updatedBooking;
    }
    catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Booking not found");
        }

        console.error(`Error updating payment status: ${error}`);
        throw new InternalServerError("Failed to update payment status");
    }
}

// Service to Delete a Booking
export async function deleteBookingService(bookingId: number): Promise<Booking> {
    try {
        const deletedBooking = await prisma.booking.delete({
            where: {
                id: bookingId
            }
        });

        return deletedBooking;
    }
    catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError("Booking not found");
        }

        console.error(`Error deleting booking: ${error}`);
        throw new InternalServerError("Failed to delete booking");
    }
}

// Service to get All Bookings
export async function getAllBookingsService(): Promise<Booking[] | null> {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                villa: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return bookings;
    }
    catch (error) {
        console.error(`Error fetching all bookings: ${error}`);
        throw new InternalServerError("Failed to fetch bookings");
    }
}

// Service to get A Booking
export async function getABookingService(bookingId: number): Promise<Booking | null> {
    try {
        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            },
            include: {
                villa: true
            }
        });

        return booking;
    }
    catch (error) {
        console.error(`Error fetching booking: ${error}`);
        throw new InternalServerError("Failed to fetch booking details");
    }
}

// Service to Search and Filter Bookings
export async function searchAndFilterBookingsService(validatedData: searchAndFilterBookingData): Promise<Booking[] | null> {
    try {
        let where: any = {};

        if (validatedData.searchText && validatedData.searchText.trim()) {
            where.OR = [
                {
                    guestName: {
                        contains: validatedData.searchText
                    }
                },
                {
                    guestPhone: {
                        contains: validatedData.searchText
                    }
                },
                {
                    villa: {
                        name: {
                            contains: validatedData.searchText
                        }
                    }
                }
            ];
        }

        if (validatedData.bookingStatus && validatedData.bookingStatus.trim()) {
            where.bookingStatus = validatedData.bookingStatus;
        };

        if (validatedData.paymentStatus && validatedData.paymentStatus.trim()) {
            where.paymentStatus = validatedData.paymentStatus;
        };

        if (validatedData.checkInDate && validatedData.checkInDate.trim()) {
            const selectedDate = new Date(validatedData.checkInDate);
            const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

            where.checkIn = {
                gte: startOfDay,
                lte: endOfDay
            };
        };

        const bookings = await prisma.booking.findMany({
            where: where,
            include: {
                villa: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return bookings;
    }
    catch (error) {
        console.error(`Error searching and filtering bookings: ${error}`);
        throw new InternalServerError("Failed to search bookings");
    };
};