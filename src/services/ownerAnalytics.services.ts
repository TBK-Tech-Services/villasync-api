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
                name: true
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

                const avgNightlyRate = totalNights > 0 ? Math.round(monthlyRevenue / totalNights) : 0;
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

// Service to Get Aggregate Performance KPIs
export async function getOwnerPerformanceService({ ownerId }: { ownerId: number }) {
    try {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const villas = await prisma.villa.findMany({
            where: { ownerId },
            select: { id: true }
        });
        const villaIds = villas.map(v => v.id);
        const villaCount = villaIds.length;

        if (villaCount === 0) {
            return { occupancyRate: 0, revPAR: 0, avgStayLength: 0, bookingSourceBreakdown: [], totalNightsBooked: 0, totalAvailableNights: 0, totalBookings: 0 };
        }

        const totalAvailableNights = daysInMonth * villaCount;

        const bookings = await prisma.booking.findMany({
            where: {
                villaId: { in: villaIds },
                checkIn: { gte: currentMonthStart, lte: currentMonthEnd },
                bookingStatus: { not: 'CANCELLED' }
            },
            select: { totalPayableAmount: true, checkIn: true, checkOut: true, bookingSource: true }
        });

        let totalNightsBooked = 0;
        let totalRevenue = 0;
        const sourceMap: Record<string, number> = {};

        for (const booking of bookings) {
            const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
            totalNightsBooked += nights;
            totalRevenue += Number(booking.totalPayableAmount);
            const src = booking.bookingSource || 'Direct';
            sourceMap[src] = (sourceMap[src] || 0) + 1;
        }

        const occupancyRate = parseFloat(((totalNightsBooked / totalAvailableNights) * 100).toFixed(1));
        const revPAR = totalAvailableNights > 0 ? Math.round(totalRevenue / totalAvailableNights) : 0;
        const avgStayLength = bookings.length > 0 ? parseFloat((totalNightsBooked / bookings.length).toFixed(1)) : 0;
        const bookingSourceBreakdown = Object.entries(sourceMap)
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count);

        return { occupancyRate, revPAR, avgStayLength, bookingSourceBreakdown, totalNightsBooked, totalAvailableNights, totalBookings: bookings.length };
    }
    catch (error) {
        console.error(`Error while getting owner performance: ${error}`);
        throw new InternalServerError("Failed to retrieve owner performance");
    }
}

// Service to Get Owner Net Revenue
export async function getOwnerNetRevenueService({ ownerId }: { ownerId: number }) {
    try {
        const [villaRows, ownerData] = await Promise.all([
            prisma.villa.findMany({ where: { ownerId }, select: { id: true } }),
            prisma.user.findUnique({ where: { id: ownerId }, select: { managementFeePercent: true } })
        ]);
        const villaIds = villaRows.map(v => v.id);
        const feePercent = Number(ownerData?.managementFeePercent) || 0;

        if (villaIds.length === 0) {
            return { lifetimeNetRevenue: 0, lifetimeIncome: 0, lifetimeExpenses: 0, lifetimeManagementFee: 0, managementFeePercent: feePercent, currentMonth: { income: 0, expenses: 0, managementFee: 0, netRevenue: 0, isPositive: true }, monthly: [], margin: 0, isPositive: true };
        }

        // Lifetime income
        const lifetimeIncomeResult = await prisma.booking.aggregate({
            where: { villaId: { in: villaIds }, bookingStatus: { not: 'CANCELLED' } },
            _sum: { totalPayableAmount: true }
        });
        const lifetimeIncome = Number(lifetimeIncomeResult._sum.totalPayableAmount) || 0;
        const lifetimeManagementFee = Math.round((feePercent / 100) * lifetimeIncome * 100) / 100;

        // Lifetime expenses: INDIVIDUAL + SPLIT
        const [ltIndExp, ltSplitExp] = await Promise.all([
            prisma.expense.aggregate({
                where: { villaId: { in: villaIds }, type: 'INDIVIDUAL' },
                _sum: { amount: true }
            }),
            prisma.expenseVilla.aggregate({
                where: { villaId: { in: villaIds }, expense: { type: 'SPLIT' } },
                _sum: { amount: true }
            })
        ]);
        const lifetimeExpenses = ((Number(ltIndExp._sum.amount) || 0) + (Number(ltSplitExp._sum.amount) || 0)) / 100;
        const lifetimeNetRevenue = lifetimeIncome - lifetimeManagementFee - lifetimeExpenses;
        const margin = lifetimeIncome > 0 ? Math.round((lifetimeNetRevenue / lifetimeIncome) * 10000) / 100 : 0;

        // Current month
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const [cmIncome, cmIndExp, cmSplitExp] = await Promise.all([
            prisma.booking.aggregate({
                where: { villaId: { in: villaIds }, checkIn: { gte: currentMonthStart, lte: currentMonthEnd }, bookingStatus: { not: 'CANCELLED' } },
                _sum: { totalPayableAmount: true }
            }),
            prisma.expense.aggregate({
                where: { villaId: { in: villaIds }, date: { gte: currentMonthStart, lte: currentMonthEnd }, type: 'INDIVIDUAL' },
                _sum: { amount: true }
            }),
            prisma.expenseVilla.aggregate({
                where: { villaId: { in: villaIds }, expense: { date: { gte: currentMonthStart, lte: currentMonthEnd }, type: 'SPLIT' } },
                _sum: { amount: true }
            })
        ]);
        const currentMonthIncome = Number(cmIncome._sum.totalPayableAmount) || 0;
        const currentMonthManagementFee = Math.round((feePercent / 100) * currentMonthIncome * 100) / 100;
        const currentMonthExpenses = ((Number(cmIndExp._sum.amount) || 0) + (Number(cmSplitExp._sum.amount) || 0)) / 100;
        const currentMonthNetRevenue = currentMonthIncome - currentMonthManagementFee - currentMonthExpenses;

        // Last 12 months breakdown
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthly = [];

        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = monthDate.getFullYear();
            const monthIndex = monthDate.getMonth();
            const monthStart = new Date(year, monthIndex, 1);
            const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

            const [mIncome, mIndExp, mSplitExp] = await Promise.all([
                prisma.booking.aggregate({
                    where: { villaId: { in: villaIds }, checkIn: { gte: monthStart, lte: monthEnd }, bookingStatus: { not: 'CANCELLED' } },
                    _sum: { totalPayableAmount: true }
                }),
                prisma.expense.aggregate({
                    where: { villaId: { in: villaIds }, date: { gte: monthStart, lte: monthEnd }, type: 'INDIVIDUAL' },
                    _sum: { amount: true }
                }),
                prisma.expenseVilla.aggregate({
                    where: { villaId: { in: villaIds }, expense: { date: { gte: monthStart, lte: monthEnd }, type: 'SPLIT' } },
                    _sum: { amount: true }
                })
            ]);

            const mInc = Number(mIncome._sum.totalPayableAmount) || 0;
            const mFee = Math.round((feePercent / 100) * mInc * 100) / 100;
            const mExp = ((Number(mIndExp._sum.amount) || 0) + (Number(mSplitExp._sum.amount) || 0)) / 100;

            monthly.push({ month: MONTHS[monthIndex], year, income: mInc, managementFee: mFee, expenses: mExp, netRevenue: mInc - mFee - mExp });
        }

        return {
            managementFeePercent: feePercent,
            lifetimeNetRevenue,
            lifetimeIncome,
            lifetimeExpenses,
            lifetimeManagementFee,
            currentMonth: { income: currentMonthIncome, expenses: currentMonthExpenses, managementFee: currentMonthManagementFee, netRevenue: currentMonthNetRevenue, isPositive: currentMonthNetRevenue >= 0 },
            monthly,
            margin,
            isPositive: lifetimeNetRevenue >= 0
        };
    }
    catch (error) {
        console.error(`Error while getting owner net revenue: ${error}`);
        throw new InternalServerError("Failed to retrieve owner net revenue");
    }
}

// Service to Get Monthly Revenue
export async function getMonthlyRevenueService({ ownerId }: { ownerId: number }) {
    try {
        const now = new Date();
        const monthsToFetch = 12;
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