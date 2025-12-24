import { InternalServerError } from "../utils/errors/customErrors.ts";
import prisma from "../db/DB.ts";

// Service to Get Owner Dashboard Stats
export async function getOwnerDashboardStatsService({ ownerId }: { ownerId: number }): Promise<any> {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const myVillasCount = await prisma.villa.count({
            where: {
                ownerId: ownerId
            }
        });

        const activeBookings = await prisma.booking.count({
            where: {
                villa: {
                    ownerId: ownerId
                },
                bookingStatus: {
                    in: ['CONFIRMED', 'CHECKED_IN']
                }
            }
        });

        const monthlyBookings = await prisma.booking.findMany({
            where: {
                villa: {
                    ownerId: ownerId
                },
                checkIn: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd
                },
                bookingStatus: {
                    not: 'CANCELLED'
                }
            },
            select: {
                totalPayableAmount: true
            }
        });

        // FIX: Convert Decimal to Number before arithmetic
        const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + Number(booking.totalPayableAmount), 0);

        const totalGuestsData = await prisma.booking.findMany({
            where: {
                villa: {
                    ownerId: ownerId
                },
                checkIn: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd
                },
                bookingStatus: {
                    not: 'CANCELLED'
                }
            },
            select: {
                totalGuests: true
            }
        });

        const totalGuests = totalGuestsData.reduce((sum, booking) => sum + booking.totalGuests, 0);

        return {
            myVillasCount,
            activeBookings,
            monthlyRevenue,
            totalGuests
        };
    }
    catch (error) {
        console.error(`Error while getting owner dashboard stats: ${error}`);
        throw new InternalServerError("Failed to retrieve dashboard statistics");
    }
}

// Service to Get Owner Villas
export async function getOwnerVillasService({ ownerId }: { ownerId: number }): Promise<any> {
    try {
        const villas = await prisma.villa.findMany({
            where: {
                ownerId: ownerId
            },
            select: {
                id: true,
                name: true,
                location: true,
                maxGuests: true,
                price: true,
                status: true,
                _count: {
                    select: {
                        bookings: {
                            where: {
                                bookingStatus: {
                                    in: ['CONFIRMED', 'CHECKED_IN']
                                }
                            }
                        }
                    }
                }
            }
        });

        const totalCount = villas.length;

        const villasWithBookings = villas.map(villa => ({
            id: villa.id,
            name: villa.name,
            location: villa.location,
            maxGuests: villa.maxGuests,
            pricePerNight: villa.price,
            status: villa.status,
            currentBookings: villa._count.bookings
        }));

        return {
            totalCount,
            villas: villasWithBookings
        };
    }
    catch (error) {
        console.error(`Error while getting owner villas: ${error}`);
        throw new InternalServerError("Failed to retrieve villas");
    }
}

// Service to Get Recent Bookings
export async function getRecentBookingsService({ ownerId }: { ownerId: number }): Promise<any> {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                villa: {
                    ownerId: ownerId
                }
            },
            select: {
                id: true,
                guestName: true,
                bookingStatus: true,
                checkIn: true,
                checkOut: true,
                totalGuests: true,
                createdAt: true,
                paymentStatus: true,
                totalPayableAmount: true,
                villa: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        const totalCount = bookings.length;

        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            guestName: booking.guestName,
            bookingStatus: booking.bookingStatus,
            villaId: booking.villa.id,
            villaName: booking.villa.name,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalGuests: booking.totalGuests,
            bookedOn: booking.createdAt,
            paymentStatus: booking.paymentStatus,
            // FIX: Convert Decimal to Number
            amount: Number(booking.totalPayableAmount)
        }));

        return {
            totalCount,
            bookings: formattedBookings
        };
    }
    catch (error) {
        console.error(`Error while getting recent bookings: ${error}`);
        throw new InternalServerError("Failed to retrieve recent bookings");
    }
}