import prisma from "../db/DB.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to Get Analytics Summary
export async function getAnalyticsSummaryService({ ownerId }: { ownerId: number }) {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const currentMonthBookings = await prisma.booking.findMany({
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
        const currentMonthRevenue = currentMonthBookings.reduce((sum, booking) => sum + Number(booking.totalPayableAmount), 0);
        const currentMonthBookingsCount = currentMonthBookings.length;
        const avgBookingValue = currentMonthBookingsCount > 0 ? Math.round(currentMonthRevenue / currentMonthBookingsCount) : 0;

        const previousMonthBookings = await prisma.booking.findMany({
            where: {
                villa: {
                    ownerId: ownerId
                },
                checkIn: {
                    gte: previousMonthStart,
                    lte: previousMonthEnd
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
        const previousMonthRevenue = previousMonthBookings.reduce((sum, booking) => sum + Number(booking.totalPayableAmount), 0);
        const previousMonthBookingsCount = previousMonthBookings.length;
        const previousAvgBookingValue = previousMonthBookingsCount > 0 ? Math.round(previousMonthRevenue / previousMonthBookingsCount) : 0;

        const revenueChangePercent = previousMonthRevenue > 0
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : 0;

        const bookingsChangePercent = previousMonthBookingsCount > 0
            ? ((currentMonthBookingsCount - previousMonthBookingsCount) / previousMonthBookingsCount) * 100
            : 0;

        return {
            currentMonth: {
                revenue: currentMonthRevenue,
                bookings: currentMonthBookingsCount,
                avgBookingValue: avgBookingValue
            },
            previousMonth: {
                revenue: previousMonthRevenue,
                bookings: previousMonthBookingsCount,
                avgBookingValue: previousAvgBookingValue
            },
            changes: {
                revenueChangePercent: parseFloat(revenueChangePercent.toFixed(1)),
                bookingsChangePercent: parseFloat(bookingsChangePercent.toFixed(1))
            }
        };
    }
    catch (error) {
        console.error(`Error while getting analytics summary: ${error}`);
        throw new InternalServerError("Failed to retrieve analytics summary");
    }
}

// Service to Get Villa Performance
export async function getVillaPerformanceService({ ownerId }: { ownerId: number }) {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const daysInMonth = currentMonthEnd.getDate();

        const villas = await prisma.villa.findMany({
            where: {
                ownerId: ownerId
            },
            select: {
                id: true,
                name: true,
                price: true
            }
        });

        const villaPerformances = await Promise.all(
            villas.map(async (villa) => {
                const bookings = await prisma.booking.findMany({
                    where: {
                        villaId: villa.id,
                        checkIn: {
                            gte: currentMonthStart,
                            lte: currentMonthEnd
                        },
                        bookingStatus: {
                            not: 'CANCELLED'
                        }
                    },
                    select: {
                        totalPayableAmount: true,
                        checkIn: true,
                        checkOut: true
                    }
                });

                const totalBookings = bookings.length;
                // FIX: Convert Decimal to Number before arithmetic
                const monthlyRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalPayableAmount), 0);

                let totalNights = 0;
                bookings.forEach(booking => {
                    const checkIn = new Date(booking.checkIn);
                    const checkOut = new Date(booking.checkOut);
                    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                    totalNights += nights;
                });

                const avgNightlyRate = totalNights > 0 ? Math.round(monthlyRevenue / totalNights) : villa.price;
                const occupancyRate = totalNights > 0 ? Math.round((totalNights / daysInMonth) * 100) : 0;

                return {
                    villaId: villa.id,
                    villaName: villa.name,
                    monthlyRevenue,
                    totalBookings,
                    avgNightlyRate,
                    occupancyRate,
                    totalNights
                };
            })
        );

        return {
            villas: villaPerformances
        };
    }
    catch (error) {
        console.error(`Error while getting villa performance: ${error}`);
        throw new InternalServerError("Failed to retrieve villa performance");
    }
}

// Service to Get Monthly Revenue
export async function getMonthlyRevenueService({ ownerId }: { ownerId: number }) {
    try {
        const now = new Date();
        const monthsToFetch = 3;
        const monthsData = [];

        for (let i = 0; i < monthsToFetch; i++) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

            const bookings = await prisma.booking.findMany({
                where: {
                    villa: {
                        ownerId: ownerId
                    },
                    checkIn: {
                        gte: monthStart,
                        lte: monthEnd
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
            const revenue = bookings.reduce((sum, booking) => sum + Number(booking.totalPayableAmount), 0);
            const bookingsCount = bookings.length;
            const avgBookingValue = bookingsCount > 0 ? Math.round(revenue / bookingsCount) : 0;

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = `${monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}`;

            monthsData.push({
                month: monthName,
                revenue,
                bookings: bookingsCount,
                avgBookingValue
            });
        }

        return {
            months: monthsData
        };
    }
    catch (error) {
        console.error(`Error while getting monthly revenue: ${error}`);
        throw new InternalServerError("Failed to retrieve monthly revenue");
    }
}