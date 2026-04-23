import puppeteer from 'puppeteer';
import { createFinanceReportHTML } from "../templates/financeReport.template.ts";
import prisma from "../db/DB.ts";
import type { getFinanceQueryParamsData } from "../validators/data-validators/finance/getFinanceParams.ts";
import { isVillaPresentService } from "./villas.services.ts";

// Service 1: Calculate Total Income Card Data
export async function getTotalIncomeService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let where: any = {};

        if (filters.month) {
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(currentYear, filters.month - 1, 1);
            const endOfMonth = new Date(currentYear, filters.month, 0);

            where.checkIn = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }
        else if ((filters.startDate && filters.endDate) && (!filters.month)) {
            where.checkIn = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            where.checkIn = {
                gte: startOfYear,
                lte: endOfYear
            };
        }

        if (filters.villaId) {
            where.villaId = filters.villaId;
        }

        where.bookingStatus = { not: 'CANCELLED' };

        const totalIncomeResult = await prisma.booking.aggregate({
            where: where,
            _sum: {
                totalPayableAmount: true
            }
        });

        const currentTotalIncome = Number(totalIncomeResult._sum.totalPayableAmount) || 0;

        let previousWhere: any = {};

        if (filters.month) {
            const currentYear = new Date().getFullYear();
            let prevMonth = filters.month - 1;
            let prevYear = currentYear;

            if (prevMonth === 0) {
                prevMonth = 12;
                prevYear = currentYear - 1;
            }

            const startOfPrevMonth = new Date(prevYear, prevMonth - 1, 1);
            const endOfPrevMonth = new Date(prevYear, prevMonth, 0);

            previousWhere = {
                checkIn: {
                    gte: startOfPrevMonth,
                    lte: endOfPrevMonth
                }
            };
        }
        else if (filters.startDate && filters.endDate) {
            const durationMs = filters.endDate.getTime() - filters.startDate.getTime();
            const previousEndDate = new Date(filters.startDate.getTime() - 1);
            const previousStartDate = new Date(previousEndDate.getTime() - durationMs);

            previousWhere = {
                checkIn: {
                    gte: previousStartDate,
                    lte: previousEndDate
                }
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const prevYear = currentYear - 1;
            const startOfPrevYear = new Date(prevYear, 0, 1);
            const endOfPrevYear = new Date(prevYear, 11, 31);

            previousWhere = {
                checkIn: {
                    gte: startOfPrevYear,
                    lte: endOfPrevYear
                }
            };
        }

        if (filters.villaId) {
            previousWhere.villaId = filters.villaId;
        }

        previousWhere.bookingStatus = { not: 'CANCELLED' };

        const previousIncomeResult = await prisma.booking.aggregate({
            where: previousWhere,
            _sum: {
                totalPayableAmount: true
            }
        });

        const previousTotalIncome = Number(previousIncomeResult._sum.totalPayableAmount) || 0;

        let growthPercentage = 0;
        if (previousTotalIncome > 0) {
            growthPercentage = ((currentTotalIncome - previousTotalIncome) / previousTotalIncome) * 100;
        }
        else if (currentTotalIncome > 0) {
            growthPercentage = 100;
        }

        const isGrowthPositive = (growthPercentage >= 0);

        return {
            totalIncome: currentTotalIncome,
            growthPercentage: Math.round(growthPercentage * 100) / 100,
            isGrowthPositive: isGrowthPositive
        };

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting total income : ${message}`);
        throw new Error(`Error while getting total income : ${message}`);
    }
}

// Service 2: Calculate Total Expense Card Data
export async function getTotalExpenseService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let where: any = {};

        // Date filters
        if (filters.month) {
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(currentYear, filters.month - 1, 1);
            const endOfMonth = new Date(currentYear, filters.month, 0);

            where.date = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }
        else if (filters.startDate && filters.endDate && !filters.month) {
            where.date = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            where.date = {
                gte: startOfYear,
                lte: endOfYear
            };
        }

        // Calculate INDIVIDUAL expenses
        let individualWhere = { ...where, type: 'INDIVIDUAL' };
        if (filters.villaId) {
            individualWhere.villaId = filters.villaId;
        }

        const individualExpensesResult = await prisma.expense.aggregate({
            where: individualWhere,
            _sum: {
                amount: true
            }
        });

        const individualTotal = individualExpensesResult._sum.amount || 0;

        // Calculate SPLIT expenses
        let splitWhere = { ...where, type: 'SPLIT' };

        const splitExpenses = await prisma.expenseVilla.aggregate({
            where: {
                expense: splitWhere,
                ...(filters.villaId ? { villaId: filters.villaId } : {})
            },
            _sum: {
                amount: true
            }
        });

        const splitTotal = splitExpenses._sum.amount || 0;

        // Divide by 100: expenses are stored in paise, return in rupees
        const currentTotalExpense = (individualTotal + splitTotal) / 100;

        // Previous period calculation
        let previousWhere: any = {};

        if (filters.month) {
            const currentYear = new Date().getFullYear();
            let prevMonth = filters.month - 1;
            let prevYear = currentYear;

            if (prevMonth === 0) {
                prevMonth = 12;
                prevYear = currentYear - 1;
            }

            const startOfPrevMonth = new Date(prevYear, prevMonth - 1, 1);
            const endOfPrevMonth = new Date(prevYear, prevMonth, 0);

            previousWhere = {
                date: {
                    gte: startOfPrevMonth,
                    lte: endOfPrevMonth
                }
            };
        }
        else if (filters.startDate && filters.endDate) {
            const durationMs = filters.endDate.getTime() - filters.startDate.getTime();
            const previousEndDate = new Date(filters.startDate.getTime() - 1);
            const previousStartDate = new Date(previousEndDate.getTime() - durationMs);

            previousWhere = {
                date: {
                    gte: previousStartDate,
                    lte: previousEndDate
                }
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const prevYear = currentYear - 1;
            const startOfPrevYear = new Date(prevYear, 0, 1);
            const endOfPrevYear = new Date(prevYear, 11, 31);

            previousWhere = {
                date: {
                    gte: startOfPrevYear,
                    lte: endOfPrevYear
                }
            };
        }

        // Previous INDIVIDUAL
        let prevIndividualWhere = { ...previousWhere, type: 'INDIVIDUAL' };
        if (filters.villaId) {
            prevIndividualWhere.villaId = filters.villaId;
        }

        const prevIndividualResult = await prisma.expense.aggregate({
            where: prevIndividualWhere,
            _sum: {
                amount: true
            }
        });

        const prevIndividualTotal = prevIndividualResult._sum.amount || 0;

        // Previous SPLIT
        let prevSplitWhere = { ...previousWhere, type: 'SPLIT' };

        const prevSplitResult = await prisma.expenseVilla.aggregate({
            where: {
                expense: prevSplitWhere,
                ...(filters.villaId ? { villaId: filters.villaId } : {})
            },
            _sum: {
                amount: true
            }
        });

        const prevSplitTotal = prevSplitResult._sum.amount || 0;

        // Divide by 100: expenses are stored in paise, return in rupees
        const previousTotalExpense = (prevIndividualTotal + prevSplitTotal) / 100;

        // Growth calculation
        let growthPercentage = 0;
        if (previousTotalExpense > 0) {
            growthPercentage = ((currentTotalExpense - previousTotalExpense) / previousTotalExpense) * 100;
        }
        else if (currentTotalExpense > 0) {
            growthPercentage = 100;
        }

        const isGrowthPositive = (growthPercentage >= 0);

        return {
            totalExpenses: currentTotalExpense,
            growthPercentage: Math.round(growthPercentage * 100) / 100,
            isGrowthPositive: isGrowthPositive
        };

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting total expense : ${message}`);
        throw new Error(`Error while getting total expense : ${message}`);
    }
}

// Service 3: Calculate Net Profit/Loss Card Data
export async function getNetProfitLossService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        const incomeData = await getTotalIncomeService(filters);
        const expenseData = await getTotalExpenseService(filters);

        const totalIncome = incomeData.totalIncome;
        const totalExpenses = expenseData.totalExpenses;

        const netAmount = totalIncome - totalExpenses;
        const isProfit = netAmount > 0;

        let profitMargin = 0;
        if (totalIncome > 0) {
            profitMargin = (netAmount / totalIncome) * 100;
        }

        // Previous period profit/loss
        const previousIncome = incomeData.totalIncome / (1 + incomeData.growthPercentage / 100);
        const previousExpense = expenseData.totalExpenses / (1 + expenseData.growthPercentage / 100);
        const previousNetAmount = previousIncome - previousExpense;

        let growthPercentage = 0;
        if (previousNetAmount !== 0) {
            growthPercentage = ((netAmount - previousNetAmount) / Math.abs(previousNetAmount)) * 100;
        }
        else if (netAmount !== 0) {
            growthPercentage = 100;
        }

        return {
            netAmount: netAmount,
            isProfit: isProfit,
            profitMargin: Math.round(profitMargin * 100) / 100,
            growthPercentage: Math.round(growthPercentage * 100) / 100
        };

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting net profit/loss : ${message}`);
        throw new Error(`Error while getting net profit/loss : ${message}`);
    }
}

// Service 4: Calculate Average Monthly Profit Card Data
export async function getAverageMonthlyProfitService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        const monthlyData = await getMonthlyIncomeExpenseChartService(filters);

        if (!monthlyData || monthlyData.length === 0) {
            return { averageMonthlyProfit: 0 };
        }

        const totalProfit = monthlyData.reduce((sum: number, item: any) => {
            return sum + (item.income - item.expense);
        }, 0);

        const averageMonthlyProfit = totalProfit / monthlyData.length;

        return {
            averageMonthlyProfit: Math.round(averageMonthlyProfit)
        };

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting average monthly profit : ${message}`);
        throw new Error(`Error while getting average monthly profit : ${message}`);
    }
}

// Service 5: Get Monthly Income vs Expense Chart Data
export async function getMonthlyIncomeExpenseChartService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let startMonth = 0;
        let endMonth = 11;
        let year = new Date().getFullYear();

        if (filters.month) {
            // Show last 6 months including selected
            endMonth = filters.month - 1;
            startMonth = Math.max(0, endMonth - 5);
        }
        else if (filters.startDate && filters.endDate) {
            startMonth = filters.startDate.getMonth();
            endMonth = filters.endDate.getMonth();
            year = filters.startDate.getFullYear();
        }

        const result = [];

        for (let i = startMonth; i <= endMonth; i++) {
            // Clamp to actual filter boundaries so chart matches KPI data exactly
            const rawMonthStart = new Date(year, i, 1);
            const rawMonthEnd = new Date(year, i + 1, 0, 23, 59, 59, 999);
            const monthStart = (filters.startDate && i === startMonth) ? filters.startDate : rawMonthStart;
            const monthEnd = (filters.endDate && i === endMonth) ? filters.endDate : rawMonthEnd;

            let incomeWhere: any = {
                checkIn: {
                    gte: monthStart,
                    lte: monthEnd
                },
                bookingStatus: { not: 'CANCELLED' }
            };

            if (filters.villaId) {
                incomeWhere.villaId = filters.villaId;
            }

            const incomeResult = await prisma.booking.aggregate({
                where: incomeWhere,
                _sum: {
                    totalPayableAmount: true
                }
            });

            // Expense calculation
            let expenseWhere: any = {
                date: {
                    gte: monthStart,
                    lte: monthEnd
                }
            };

            let individualWhere = { ...expenseWhere, type: 'INDIVIDUAL' };
            if (filters.villaId) {
                individualWhere.villaId = filters.villaId;
            }

            const individualExpense = await prisma.expense.aggregate({
                where: individualWhere,
                _sum: { amount: true }
            });

            let splitWhere = { ...expenseWhere, type: 'SPLIT' };
            const splitExpense = await prisma.expenseVilla.aggregate({
                where: {
                    expense: splitWhere,
                    ...(filters.villaId ? { villaId: filters.villaId } : {})
                },
                _sum: { amount: true }
            });

            const monthIncome = Number(incomeResult._sum.totalPayableAmount) || 0;
            // Divide by 100: expenses stored in paise, return in rupees
            const monthExpense = ((individualExpense._sum.amount || 0) + (splitExpense._sum.amount || 0)) / 100;

            result.push({
                month: months[i],
                income: monthIncome,
                expense: monthExpense
            });
        }

        return result;

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting monthly chart data : ${message}`);
        throw new Error(`Error while getting monthly chart data : ${message}`);
    }
}

// Service 6: Get Profit Trend Chart Data
export async function getProfitTrendChartService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        const monthlyData = await getMonthlyIncomeExpenseChartService(filters);

        const profitTrend = monthlyData.map((item: any) => ({
            month: item.month,
            profit: item.income - item.expense
        }));

        return profitTrend;

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting profit trend : ${message}`);
        throw new Error(`Error while getting profit trend : ${message}`);
    }
}

// Service 7: Get Villa Performance Data
export async function getVillaPerformanceService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let villas;

        if (filters.villaId) {
            villas = await prisma.villa.findMany({
                where: { id: filters.villaId },
                select: { id: true, name: true }
            });
        } else {
            villas = await prisma.villa.findMany({
                select: { id: true, name: true }
            });
        }

        const performance = [];

        for (const villa of villas) {
            const villaFilters = { ...filters, villaId: villa.id };

            const incomeData = await getTotalIncomeService(villaFilters);
            const expenseData = await getTotalExpenseService(villaFilters);

            const income = incomeData.totalIncome;
            const expenses = expenseData.totalExpenses;
            const profit = income - expenses;

            let profitMargin = 0;
            if (income > 0) {
                profitMargin = (profit / income) * 100;
            }

            performance.push({
                villaId: villa.id,
                villaName: villa.name,
                income: income,
                profit: profit,
                profitMargin: Math.round(profitMargin * 100) / 100
            });
        }

        performance.sort((a, b) => b.profit - a.profit);

        return performance;

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting villa performance : ${message}`);
        throw new Error(`Error while getting villa performance : ${message}`);
    }
}

// Service 8: Get Expense Breakdown Pie Chart Data
export async function getExpenseBreakdownService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let where: any = {};

        if (filters.month) {
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(currentYear, filters.month - 1, 1);
            const endOfMonth = new Date(currentYear, filters.month, 0);

            where.date = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }
        else if (filters.startDate && filters.endDate && !filters.month) {
            where.date = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            where.date = {
                gte: startOfYear,
                lte: endOfYear
            };
        }

        const categories = await prisma.expenseCategory.findMany();
        const breakdown = [];

        for (const category of categories) {
            let categoryWhere = { ...where, categoryId: category.id };

            // INDIVIDUAL expenses
            let individualWhere = { ...categoryWhere, type: 'INDIVIDUAL' };
            if (filters.villaId) {
                individualWhere.villaId = filters.villaId;
            }

            const individualResult = await prisma.expense.aggregate({
                where: individualWhere,
                _sum: { amount: true }
            });

            // SPLIT expenses
            let splitWhere = { ...categoryWhere, type: 'SPLIT' };
            const splitResult = await prisma.expenseVilla.aggregate({
                where: {
                    expense: splitWhere,
                    ...(filters.villaId ? { villaId: filters.villaId } : {})
                },
                _sum: { amount: true }
            });

            // Divide by 100: expenses stored in paise, return in rupees
            const categoryAmount = ((individualResult._sum.amount || 0) + (splitResult._sum.amount || 0)) / 100;

            if (categoryAmount > 0) {
                breakdown.push({
                    category: category.name,
                    amount: categoryAmount
                });
            }
        }

        const totalExpenses = breakdown.reduce((sum, item) => sum + item.amount, 0);

        const result = breakdown.map(item => ({
            category: item.category,
            amount: item.amount,
            percentage: totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 10000) / 100 : 0
        }));

        result.sort((a, b) => b.amount - a.amount);

        return result;

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting expense breakdown : ${message}`);
        throw new Error(`Error while getting expense breakdown : ${message}`);
    }
}

// Main Service: Orchestrate All Dashboard Data
export async function getFinanceDashboardService(queryParams: getFinanceQueryParamsData): Promise<any> {
    try {
        if (queryParams.villaId) {
            const villa = await isVillaPresentService({ villaId: queryParams.villaId });

            if (!villa) {
                throw new Error(`Villa with ID ${queryParams.villaId} not found`);
            }
        }

        const [
            totalIncomeData,
            totalExpenseData,
            netProfitLossData,
            averageMonthlyData,
            monthlyChartData,
            profitTrendData,
            villaPerformanceData,
            expenseBreakdownData
        ] = await Promise.all([
            getTotalIncomeService(queryParams),
            getTotalExpenseService(queryParams),
            getNetProfitLossService(queryParams),
            getAverageMonthlyProfitService(queryParams),
            getMonthlyIncomeExpenseChartService(queryParams),
            getProfitTrendChartService(queryParams),
            getVillaPerformanceService(queryParams),
            getExpenseBreakdownService(queryParams)
        ]);

        const financeDashboardData = {
            summaryCards: {
                totalIncome: totalIncomeData,
                totalExpenses: totalExpenseData,
                netProfitLoss: netProfitLossData,
                averageMonthly: averageMonthlyData
            },
            charts: {
                monthlyIncomeExpense: monthlyChartData,
                profitTrend: profitTrendData,
                expenseBreakdown: expenseBreakdownData
            },
            villaPerformance: villaPerformanceData
        };

        if (!totalIncomeData && !totalExpenseData) {
            return {
                message: "No data found for the specified filters",
                data: financeDashboardData
            };
        }

        return financeDashboardData;

    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting finance dashboard data : ${message}`);
        throw new Error(`Error while getting finance dashboard data : ${message}`);
    }
};

// Service to Get Bookings in Range
export async function getBookingsInRange(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let where: any = {};

        // Date filters
        if (filters.month) {
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(currentYear, filters.month - 1, 1);
            const endOfMonth = new Date(currentYear, filters.month, 0);

            where.checkIn = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }
        else if (filters.startDate && filters.endDate && !filters.month) {
            where.checkIn = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            where.checkIn = {
                gte: startOfYear,
                lte: endOfYear
            };
        }

        // Villa filter
        if (filters.villaId) {
            where.villaId = filters.villaId;
        }

        const bookings = await prisma.booking.findMany({
            where: where,
            include: {
                villa: { select: { name: true, location: true } }
            },
            orderBy: { checkIn: 'asc' }
        });

        return bookings;
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting bookings in range : ${message}`);
        throw new Error(`Error while getting bookings in range : ${message}`);
    }
}

// Service to Get Expenses in Range
export async function getExpensesInRange(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let where: any = {};

        // Date filters
        if (filters.month) {
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(currentYear, filters.month - 1, 1);
            const endOfMonth = new Date(currentYear, filters.month, 0);

            where.date = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }
        else if (filters.startDate && filters.endDate && !filters.month) {
            where.date = {
                gte: filters.startDate,
                lte: filters.endDate
            };
        }
        else {
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(currentYear, 0, 1);
            const endOfYear = new Date(currentYear, 11, 31);

            where.date = {
                gte: startOfYear,
                lte: endOfYear
            };
        }

        const expenses = await prisma.expense.findMany({
            where: where,
            include: {
                villa: { select: { name: true } },
                category: { select: { name: true } },
                villas: {
                    include: {
                        villa: { select: { name: true } }
                    }
                }
            },
            orderBy: { date: 'asc' }
        });

        return expenses;
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting expenses in range : ${message}`);
        throw new Error(`Error while getting expenses in range : ${message}`);
    }
}

// Service to Calculate Financial Metrics
export async function calculateFinancialMetrics(bookings: any, expenses: any): Promise<any> {
    try {
        // Exclude cancelled bookings from all income calculations
        const incomeBookings = bookings.filter((b: any) => b.bookingStatus !== 'CANCELLED');

        // Multiply by 100: PDF template's formatAmount divides by 100, so all amounts must be in paise
        const totalIncome = incomeBookings.reduce((sum: number, b: any) =>
            sum + Math.round(Number(b.totalPayableAmount) * 100), 0
        );

        const paidAmount = incomeBookings
            .filter((b: any) => b.paymentStatus === 'PAID')
            .reduce((sum: number, b: any) => sum + Math.round(Number(b.totalPayableAmount) * 100), 0);

        const pendingAmount = incomeBookings
            .filter((b: any) => b.paymentStatus === 'PENDING')
            .reduce((sum: number, b: any) => sum + Math.round(Number(b.dueAmount) * 100), 0);

        const confirmedBookings = bookings.filter((b: any) =>
            b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'CHECKED_IN'
        ).length;

        const cancelledBookings = bookings.filter((b: any) =>
            b.bookingStatus === 'CANCELLED'
        ).length;

        const totalGuests = incomeBookings.reduce((sum: number, b: any) => sum + b.totalGuests, 0);

        // Expenses are already stored in paise — keep as-is for the PDF template
        const individualExpenses = expenses
            .filter((e: any) => e.type === 'INDIVIDUAL')
            .reduce((sum: number, e: any) => sum + e.amount, 0);

        const splitExpenses = expenses
            .filter((e: any) => e.type === 'SPLIT')
            .reduce((sum: number, e: any) => {
                const splitAmount = e.villas.reduce((s: number, v: any) => s + v.amount, 0);
                return sum + splitAmount;
            }, 0);

        const totalExpenses = individualExpenses + splitExpenses;

        // Both in paise — arithmetic is valid
        const netProfit = totalIncome - totalExpenses;
        const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : '0.00';

        return {
            totalIncome,
            paidAmount,
            pendingAmount,
            averageBookingValue: incomeBookings.length > 0 ? Math.round(totalIncome / incomeBookings.length) : 0,
            totalBookings: bookings.length,
            confirmedBookings,
            cancelledBookings,
            totalGuests,
            totalExpenses,
            expenseCount: expenses.length,
            netProfit,
            profitMargin: parseFloat(profitMargin),
            isProfit: netProfit > 0
        };
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while calculating financial metrics : ${message}`);
        throw new Error(`Error while calculating financial metrics : ${message}`);
    }
}

// Service to Calculate Villa Performance
export async function calculateVillaPerformance(bookings: any, expenses: any): Promise<any> {
    try {
        const villaMap = new Map();

        // Calculate income per villa — only confirmed/non-cancelled bookings
        // Multiply by 100: PDF template's formatAmount divides by 100, all amounts must be in paise
        bookings.forEach((booking: any) => {
            if (booking.bookingStatus === 'CANCELLED') return;

            const villaName = booking.villa.name;
            const villaId = booking.villaId;

            if (!villaMap.has(villaId)) {
                villaMap.set(villaId, {
                    villaId,
                    villaName,
                    income: 0,
                    expenses: 0,
                    bookingCount: 0
                });
            }

            const villa = villaMap.get(villaId);
            villa.income += Math.round(Number(booking.totalPayableAmount) * 100);
            villa.bookingCount += 1;
        });

        // Expenses are already in paise — keep as-is
        expenses.forEach((expense: any) => {
            if (expense.type === 'INDIVIDUAL' && expense.villa) {
                const villaId = expense.villaId;
                if (villaMap.has(villaId)) {
                    const villa = villaMap.get(villaId);
                    villa.expenses += expense.amount;
                }
            }
            else if (expense.type === 'SPLIT' && expense.villas.length > 0) {
                expense.villas.forEach((v: any) => {
                    const villaId = v.villaId;
                    if (villaMap.has(villaId)) {
                        const villa = villaMap.get(villaId);
                        villa.expenses += v.amount;
                    }
                });
            }
        });

        // Calculate profit and margin
        const performance = Array.from(villaMap.values()).map(villa => ({
            villaName: villa.villaName,
            bookingCount: villa.bookingCount,
            income: villa.income,
            expenses: villa.expenses,
            netProfit: villa.income - villa.expenses,
            profitMargin: villa.income > 0
                ? ((villa.income - villa.expenses) / villa.income * 100).toFixed(2)
                : '0.00'
        }));

        // Sort by profit descending
        performance.sort((a: any, b: any) => b.netProfit - a.netProfit);

        return performance;
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while calculating villa performance : ${message}`);
        throw new Error(`Error while calculating villa performance : ${message}`);
    }
}

// Service to Calculate Monthly Trends
export async function calculateMonthlyTrends(bookings: any, expenses: any, filters: getFinanceQueryParamsData): Promise<any> {
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let startMonth = 0;
        let endMonth = 11;
        let year = new Date().getFullYear();

        if (filters.month) {
            endMonth = filters.month - 1;
            startMonth = Math.max(0, endMonth - 5);
        }
        else if (filters.startDate && filters.endDate) {
            startMonth = filters.startDate.getMonth();
            endMonth = filters.endDate.getMonth();
            year = filters.startDate.getFullYear();
        }

        const result = [];

        for (let i = startMonth; i <= endMonth; i++) {
            const monthStart = new Date(year, i, 1);
            const monthEnd = new Date(year, i + 1, 0);

            // Filter bookings for this month, excluding cancelled
            // Multiply by 100: PDF template's formatAmount divides by 100, all amounts must be in paise
            const monthBookings = bookings.filter((b: any) => {
                const checkInDate = new Date(b.checkIn);
                return checkInDate >= monthStart && checkInDate <= monthEnd && b.bookingStatus !== 'CANCELLED';
            });

            const monthIncome = monthBookings.reduce((sum: number, b: any) =>
                sum + Math.round(Number(b.totalPayableAmount) * 100), 0
            );

            // Filter expenses for this month
            const monthExpenses = expenses.filter((e: any) => {
                const expenseDate = new Date(e.date);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            });

            const individualExpense = monthExpenses
                .filter((e: any) => e.type === 'INDIVIDUAL')
                .reduce((sum: number, e: any) => sum + e.amount, 0);

            const splitExpense = monthExpenses
                .filter((e: any) => e.type === 'SPLIT')
                .reduce((sum: number, e: any) => {
                    return sum + e.villas.reduce((s: number, v: any) => s + v.amount, 0);
                }, 0);

            const monthExpense = individualExpense + splitExpense;
            const monthProfit = monthIncome - monthExpense;

            result.push({
                month: months[i],
                income: monthIncome,
                expense: monthExpense,
                profit: monthProfit
            });
        }

        return result;
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while calculating monthly trends : ${message}`);
        throw new Error(`Error while calculating monthly trends : ${message}`);
    }
}

// Service to Generate Finance Report PDF
export async function generateFinanceReportPDF(data: any): Promise<any> {
    try {
        // Create HTML from template
        const html = createFinanceReportHTML(data);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set content
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Wait for charts to render (FIXED)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            }
        });

        await browser.close();

        return pdfBuffer;
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while generating finance report PDF : ${message}`);
        throw new Error(`Error while generating finance report PDF : ${message}`);
    }
}

// Service: Get Net Revenue Dashboard Data
export async function getNetRevenueDashboardService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        if (filters.villaId) {
            const villa = await isVillaPresentService({ villaId: filters.villaId });
            if (!villa) throw new Error(`Villa with ID ${filters.villaId} not found`);
        }

        // 1. Filtered period net revenue (respects all active filters)
        const [periodIncomeData, periodExpenseData] = await Promise.all([
            getTotalIncomeService(filters),
            getTotalExpenseService(filters)
        ]);

        const periodIncome = periodIncomeData.totalIncome;
        const periodExpenses = periodExpenseData.totalExpenses;
        const periodNetRevenue = periodIncome - periodExpenses;
        const margin = periodIncome > 0
            ? Math.round((periodNetRevenue / periodIncome) * 10000) / 100
            : 0;

        // 2. Current calendar-month net revenue (villa filter only — always shows current month)
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        let cmIncomeWhere: any = {
            checkIn: { gte: currentMonthStart, lte: currentMonthEnd },
            bookingStatus: { not: 'CANCELLED' }
        };
        if (filters.villaId) cmIncomeWhere.villaId = filters.villaId;

        const cmIncomeResult = await prisma.booking.aggregate({
            where: cmIncomeWhere,
            _sum: { totalPayableAmount: true }
        });
        const currentMonthIncome = Number(cmIncomeResult._sum.totalPayableAmount) || 0;

        let cmIndExpWhere: any = { date: { gte: currentMonthStart, lte: currentMonthEnd }, type: 'INDIVIDUAL' };
        if (filters.villaId) cmIndExpWhere.villaId = filters.villaId;

        const [cmIndExp, cmSplitExp] = await Promise.all([
            prisma.expense.aggregate({ where: cmIndExpWhere, _sum: { amount: true } }),
            prisma.expenseVilla.aggregate({
                where: {
                    expense: { date: { gte: currentMonthStart, lte: currentMonthEnd }, type: 'SPLIT' },
                    ...(filters.villaId ? { villaId: filters.villaId } : {})
                },
                _sum: { amount: true }
            })
        ]);
        const currentMonthExpenses = ((cmIndExp._sum.amount || 0) + (cmSplitExp._sum.amount || 0)) / 100;
        const currentMonthNetRevenue = currentMonthIncome - currentMonthExpenses;

        // 3. Last 12 months monthly breakdown (villa filter only — date range ignored so trend always shows context)
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthly = [];

        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = monthDate.getFullYear();
            const monthIndex = monthDate.getMonth();
            const monthStart = new Date(year, monthIndex, 1);
            const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

            let mIncomeWhere: any = {
                checkIn: { gte: monthStart, lte: monthEnd },
                bookingStatus: { not: 'CANCELLED' }
            };
            if (filters.villaId) mIncomeWhere.villaId = filters.villaId;

            let mIndExpWhere: any = { date: { gte: monthStart, lte: monthEnd }, type: 'INDIVIDUAL' };
            if (filters.villaId) mIndExpWhere.villaId = filters.villaId;

            const [mIncomeResult, mIndExp, mSplitExp] = await Promise.all([
                prisma.booking.aggregate({ where: mIncomeWhere, _sum: { totalPayableAmount: true } }),
                prisma.expense.aggregate({ where: mIndExpWhere, _sum: { amount: true } }),
                prisma.expenseVilla.aggregate({
                    where: {
                        expense: { date: { gte: monthStart, lte: monthEnd }, type: 'SPLIT' },
                        ...(filters.villaId ? { villaId: filters.villaId } : {})
                    },
                    _sum: { amount: true }
                })
            ]);

            const mIncome = Number(mIncomeResult._sum.totalPayableAmount) || 0;
            const mExpenses = ((mIndExp._sum.amount || 0) + (mSplitExp._sum.amount || 0)) / 100;

            monthly.push({
                month: MONTHS[monthIndex],
                year,
                income: mIncome,
                expenses: mExpenses,
                netRevenue: mIncome - mExpenses
            });
        }

        return {
            filteredPeriod: {
                income: periodIncome,
                expenses: periodExpenses,
                netRevenue: periodNetRevenue,
                margin,
                isPositive: periodNetRevenue >= 0
            },
            currentMonth: {
                income: currentMonthIncome,
                expenses: currentMonthExpenses,
                netRevenue: currentMonthNetRevenue,
                isPositive: currentMonthNetRevenue >= 0
            },
            monthly
        };
    }
    catch (error) {
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting net revenue data : ${message}`);
        throw new Error(`Error while getting net revenue data : ${message}`);
    }
}