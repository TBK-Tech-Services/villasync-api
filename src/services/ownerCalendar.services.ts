import prisma from "../db/DB.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to Get Owner Calendar Availability
export async function getOwnerCalendarAvailabilityService({ ownerId }: { ownerId: number }) {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; 
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const bookings = await prisma.booking.findMany({
        where: {
            villa: {
                ownerId: ownerId
            },
            OR: [
                {
                    checkIn: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                {
                    checkOut: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                {
                    AND: [
                        {
                            checkIn: {
                                lte: startDate
                            }
                        },
                        {
                            checkOut: {
                                gte: endDate
                            }
                        }
                    ]
                }
            ],
            bookingStatus: {
                not: 'CANCELLED'
            }
        },
        select: {
            id: true,
            checkIn: true,
            checkOut: true,
            guestName: true,
            bookingStatus: true,
            villa: {
            select: {
                id: true,
                name: true
            }
            }
        },
        orderBy: {
            checkIn: 'asc'
        }
        });

        const bookingsByDate: any[] = [];
        
        bookings.forEach(booking => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            let currentDate = new Date(checkInDate);
            while (currentDate <= checkOutDate) {
                if (currentDate >= startDate && currentDate <= endDate) {
                    const dateString = currentDate.toISOString().split('T')[0];

                    bookingsByDate.push({
                        date: dateString,
                        villaId: booking.villa.id,
                        villaName: booking.villa.name,
                        guestName: booking.guestName,
                        status: 'booked',
                        bookingId: booking.id
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
        const checkedInBookings = bookings.filter(b => b.bookingStatus === 'CHECKED_IN').length;

        return {
            year,
            month,
            bookings: bookingsByDate,
            summary: {
                totalBookings: bookings.length,
                confirmedBookings,
                checkedInBookings,
                occupiedDays: bookingsByDate.length
            }
        };
    } 
    catch (error) {
        console.error(`Error while getting calendar availability: ${error}`);
        throw new InternalServerError("Failed to retrieve calendar availability");
    }
}