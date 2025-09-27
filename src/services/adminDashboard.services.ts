import type { Booking } from "@prisma/client";
import prisma from "../db/DB.ts";

// Service to get Total Count of Villas 
export async function getTotalVillasCountService(): Promise<number | null> {
    try {   
        const villaCount = await prisma.villa.count();

        return villaCount;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting villa count : ${message}`);
        throw new Error(`Error getting villa count : ${message}`);
    }
}

// Service to Get Total Count of Bookings
export async function getTotalBookingsCountService(): Promise<number | null> {
    try {
        const bookingsCount = await prisma.booking.count();

        return bookingsCount;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting bookings count : ${message}`);
        throw new Error(`Error getting bookings count : ${message}`);
    }
}

// Service to Get Total Revenue
export async function getTotalRevenueService(): Promise<number | null> {
    try {
        const totalRevenue = await prisma.booking.aggregate({
            where : {
                paymentStatus : 'PAID'
            },
            _sum : {
                totalPayableAmount : true
            }
        });

        return totalRevenue._sum.totalPayableAmount;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting total revenue : ${message}`);
        throw new Error(`Error getting total revenue : ${message}`);
    }
}

// Service to Get Total Count of Guest
export async function getTotalGuestsCountService(): Promise<number | null> {
    try {
        const guestCount = await prisma.booking.aggregate({
            _sum : {
                totalGuests : true
            }
        })

        return guestCount._sum.totalGuests || 0;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting bookings count : ${message}`);
        throw new Error(`Error getting bookings count : ${message}`);
    }
}

// Service to Get Count of Pending Bookings
export async function getPendingBookingsCountService(): Promise<number | null> {
    try {
        const totalPendingBookings = await prisma.booking.aggregate({
            where : {
                bookingStatus : 'CONFIRMED'
            },
            _count : {
                id : true
            }
        })

        return totalPendingBookings._count.id;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting pending bookings count : ${message}`);
        throw new Error(`Error getting pending bookings count : ${message}`);
    }
}

// Service to Get Count of Cancellations
export async function getCancellationsCountService(): Promise<number | null> {
    try {
        const totalPendingBookings = await prisma.booking.aggregate({
            where : {
                bookingStatus : 'CANCELLED'
            },
            _count : {
                id : true
            }
        })

        return totalPendingBookings._count.id;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting cancelled bookings count : ${message}`);
        throw new Error(`Error getting cancelled bookings count : ${message}`);
    }
}

// Service to Get Count of Recent Bookings
export async function getRecentBookingsService(): Promise<Booking[] | null> {
    try {
        const recentBookings = await prisma.booking.findMany({
            orderBy : {
                createdAt : 'desc'
            },
            take : 5,
            include: {
                villa: true
}
        })

        return recentBookings;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting recent bookings : ${message}`);
        throw new Error(`Error getting recent bookings : ${message}`);
    }
}

// Service to Get Todays Checkins
export async function getTodaysCheckinsService(): Promise<{ count: number, totalIncome: number }> {
    try {
        const today = new Date();
        today.setHours(0 ,0 ,0 ,0);

        const tommorow = new Date(today);
        tommorow.setDate(today.getDate() + 1);

        const result = await prisma.booking.aggregate({
            where : {
                checkIn : {
                    gte : today,
                    lt : tommorow
                }
            },
            _count : {
                id : true
            },
            _sum : {
                totalPayableAmount : true
            }
        });

        return {
            count : result._count.id || 0,
            totalIncome : result._sum.totalPayableAmount || 0
        };
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting count of todays checkins : ${message}`);
        throw new Error(`Error getting count of todays checkins : ${message}`);
    }
}

// Service to Get Tommorows Checkins
export async function getTomorrowsCheckinsService(): Promise<{ count: number, totalIncome: number }> {
    try {   
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0,0,0,0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

        const result = await prisma.booking.aggregate({
            where : {
                checkIn : {
                    gte : tomorrow,
                    lt : dayAfterTomorrow
                }
            },
            _count : {
                id : true
            },
            _sum : {
                totalPayableAmount : true
            }
        })

        return {
            count : result._count.id || 0,
            totalIncome : result._sum.totalPayableAmount || 0
        };
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting count of tommorows checkins : ${message}`);
        throw new Error(`Error getting count of tommorows checkins : ${message}`);
    }
}

// Service to Get Weeks Checkins
export async function getWeeksCheckinsService(): Promise<{ count: number, totalIncome: number }> {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay();

        const startOfWeek = new Date(today); 
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0,0,0,0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        const result = await prisma.booking.aggregate({
            where : {
                checkIn : {
                    gte : startOfWeek,
                    lte : endOfWeek
                }
            },
            _count : {
                id : true
            },
            _sum : {
                totalPayableAmount : true
            }
        });

        return {
            count : result._count.id || 0,
            totalIncome : result._sum.totalPayableAmount || 0
        };
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting count of weeks checkins : ${message}`);
        throw new Error(`Error getting count of weeks checkins : ${message}`);
    }
}

// Service to Get Current Month Revenue
export async function getCurrentMonthRevenueService(): Promise<number> {
    try {
        const currentDate = new Date();

        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        
        const currentMonthRevenue = await prisma.booking.aggregate({
            where : {
                paymentStatus: 'PAID',
                OR: [
                    { 
                        checkIn: { 
                            gte: startOfMonth, 
                            lte: endOfMonth 
                        } 
                    },
                    { 
                        checkOut: { 
                            gte: startOfMonth, 
                            lte: endOfMonth 
                        } 
                    },
                    { 
                        checkIn: { lte: startOfMonth },
                        checkOut: { gte: endOfMonth }
                    }
                ]
            },
            _sum : {
                totalPayableAmount : true
            }
        });

        return currentMonthRevenue._sum.totalPayableAmount || 0;
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting revenue for current month : ${message}`);
        throw new Error(`Error getting revenue for current month : ${message}`);
    }
}

// Service to Get Last Month Revenue
export async function getLastMonthRevenueService(): Promise<number> {
    try {
        const currentDate = new Date();

        const startDateForLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        startDateForLastMonth.setHours(0, 0, 0, 0);

        const endDateForLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        endDateForLastMonth.setHours(23, 59, 59, 999);

        const lastMonthRevenue = await prisma.booking.aggregate({
            where : {
                paymentStatus: 'PAID',
                OR: [
                    { 
                        checkIn: { 
                            gte: startDateForLastMonth, 
                            lte: endDateForLastMonth 
                        } 
                    },
                    { 
                        checkOut: { 
                            gte: startDateForLastMonth, 
                            lte: endDateForLastMonth 
                        } 
                    },
                    { 
                        checkIn: { lte: startDateForLastMonth },
                        checkOut: { gte: endDateForLastMonth }
                    }
                ]
            },
            _sum : {
                totalPayableAmount : true
            }
        });

        return lastMonthRevenue._sum.totalPayableAmount || 0;
    } 
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting revenue for last month : ${message}`);
        throw new Error(`Error getting revenue for last month : ${message}`);
    }
}

// Service to Get Average Daily Revenue
export async function getAverageDailyRevenueService(): Promise<number> {
    try {
        const lastMonthRevenue = await getLastMonthRevenueService();

        const currentDate = new Date();

        const startDateForLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        startDateForLastMonth.setHours(0, 0, 0, 0);

        const endDateForLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        endDateForLastMonth.setHours(23, 59, 59, 999);

        const totalDaysInLastMonth = endDateForLastMonth.getDate();

        const avgDailyRevenue = lastMonthRevenue / totalDaysInLastMonth;
        
        return Math.round(avgDailyRevenue);
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting average daily revenue : ${message}`);
        throw new Error(`Error getting average daily revenue : ${message}`);
    }
}

// Service to Get All Revenue Trends
export async function getRevenueTrendsService(): Promise<any | null> {
    try {
        const currentMonthRevenue = await getCurrentMonthRevenueService();
        const lastMonthRevenue = await getLastMonthRevenueService();
        const averageDailyRevenue = await getAverageDailyRevenueService();
        
        let growthRate;
        if(lastMonthRevenue === 0){
            growthRate = currentMonthRevenue > 0 ? 100 : 0;
        } 
        else {
            growthRate = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
            growthRate = Math.round(growthRate * 10) / 10;
        }

        return {
            currentMonthRevenue,
            lastMonthRevenue,
            averageDailyRevenue,
            growthRate
        };
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting Revenue Trends: ${message}`);
        throw new Error(`Error getting Revenue Trends: ${message}`);
    }
}

// Service to Get All Villas Occupancy
export async function getAllVillasOccupancyService(): Promise<any[] | null> {
    try {
        const currentDate = new Date();

        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const totalDaysInMonth = endOfMonth.getDate();

        const allVillas = await prisma.villa.findMany({
            select: {
                id: true,
                name: true
            }
        });

        const villasOccupancyPromises = allVillas.map(async (villa) => {
            const monthlyBookings = await prisma.booking.findMany({
                where: {
                    villaId: villa.id,
                    bookingStatus: {
                        in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT']
                    },
                    OR: [
                        {
                            checkIn: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            }
                        },
                        {
                            checkOut: {
                                gte: startOfMonth,
                                lte: endOfMonth
                            }
                        },
                        {
                            checkIn: {
                                lte: startOfMonth
                            },
                            checkOut: {
                                gte: endOfMonth
                            }
                        }
                    ]
                },
                select: {
                    checkIn: true,
                    checkOut: true
                }
            });

            let totalBookedDays = 0;
            
            for (const booking of monthlyBookings) {
                const actualStartDate = new Date(Math.max(booking.checkIn.getTime(), startOfMonth.getTime()));
                const actualEndDate = new Date(Math.min(booking.checkOut.getTime(), endOfMonth.getTime()));
                
                const daysDifference = Math.ceil((actualEndDate.getTime() - actualStartDate.getTime()) / (1000 * 60 * 60 * 24));
                totalBookedDays = totalBookedDays + daysDifference;
            }

            const occupancyPercentage = Math.round((totalBookedDays / totalDaysInMonth) * 100);
            const cappedOccupancy = Math.min(occupancyPercentage, 100);

            return {
                villaName: villa.name,
                occupancyPercentage: cappedOccupancy
            };
        });

        const villasOccupancy = await Promise.all(villasOccupancyPromises);

        villasOccupancy.sort((a, b) => b.occupancyPercentage - a.occupancyPercentage);

        return villasOccupancy;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error getting villas occupancy: ${message}`);
        throw new Error(`Error getting villas occupancy: ${message}`);
    }
}