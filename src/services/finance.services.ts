import prisma from "../db/DB.ts";
import type { getFinanceQueryParamsData } from "../validators/data-validators/finance/getFinanceParams.ts";
import { isVillaPresentService } from "./villas.services.ts";

// Service to Calculate Total Income Card Data
export async function getTotalIncomeService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        let where: any = {};
        
        if(filters.month){
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(currentYear, filters.month - 1, 1);
            const endOfMonth = new Date(currentYear, filters.month, 0);
            
            where.checkIn = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }
        else if((filters.startDate && filters.endDate) && (!filters.month)){
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
        
        if(filters.villaId){
            where.villaId = filters.villaId;
        }
        
        const totalIncomeResult = await prisma.booking.aggregate({
            where: where,
            _sum: {
                totalPayableAmount: true
            }
        });
        
        const currentTotalIncome = totalIncomeResult._sum.totalPayableAmount || 0;
        
        let previousWhere: any = {};
        
        if(filters.month){
            const currentYear = new Date().getFullYear();
            let prevMonth = filters.month - 1;
            let prevYear = currentYear;
            
            if(prevMonth === 0){
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
        else if(filters.startDate && filters.endDate){
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
        
        if(filters.villaId){
            previousWhere.villaId = filters.villaId;
        }
        
        const previousIncomeResult = await prisma.booking.aggregate({
            where: previousWhere,
            _sum: {
                totalPayableAmount: true
            }
        });
        
        const previousTotalIncome = previousIncomeResult._sum.totalPayableAmount || 0;
        
        let growthPercentage = 0;
        if(previousTotalIncome > 0){
            growthPercentage = ((currentTotalIncome - previousTotalIncome) / previousTotalIncome) * 100;
        } 
        else if(currentTotalIncome > 0){
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

// Service to Calculate Total Expense Card Data
export async function getTotalExpenseService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Build base query for Expense table with ExpenseCategory join
        
        // Step 2: Apply date filters on expense.date field
        // - Same date filtering logic as income service
        
        // Step 3: Handle different expense types
        // - For INDIVIDUAL type: direct villa mapping (expense.villaId)
        // - For SPLIT type: join with ExpenseVilla table
        
        // Step 4: Apply villa filter
        // - Filter by expense.villaId for INDIVIDUAL
        // - Filter by ExpenseVilla.villaId for SPLIT
        
        // Step 5: Calculate total expenses
        // - Sum expense amounts based on type
        // - For SPLIT: sum ExpenseVilla.amount, not expense.amount
        // - Handle cases where no expenses exist (return 0)
        
        // Step 6: Calculate period comparison for growth percentage
        // - Get previous period expense data
        // - Calculate percentage change
        
        // Step 7: Return formatted data for Total Expense Card
        // Return: { totalExpenses: number, growthPercentage: number, isGrowthPositive: boolean }

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Calculate Net Profit/Loss Card Data
export async function getNetProfitLossService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Get total income using getTotalIncomeService
        // - Call getTotalIncomeService(filters)
        // - Extract totalIncome value
        
        // Step 2: Get total expenses using getTotalExpenseService
        // - Call getTotalExpenseService(filters)
        // - Extract totalExpenses value
        
        // Step 3: Calculate net profit/loss
        // - netAmount = totalIncome - totalExpenses
        // - isProfit = netAmount > 0
        
        // Step 4: Calculate profit margin
        // - profitMargin = (netAmount / totalIncome) * 100
        // - Handle division by zero case (if totalIncome = 0)
        
        // Step 5: Calculate period comparison
        // - Get previous period profit/loss
        // - Calculate growth/decline percentage
        
        // Step 6: Return formatted data for Net Profit/Loss Card
        // Return: { netAmount: number, isProfit: boolean, profitMargin: number, growthPercentage: number }

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Calculate Average Monthly Profit Card Data
export async function getAverageMonthlyProfitService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Determine time period for calculation
        // - If month filter: get that month's data only
        // - If date range: use that range
        // - Default: current year (12 months)
        
        // Step 2: Get monthly income data
        // - Group bookings by month
        // - Sum totalPayableAmount per month
        
        // Step 3: Get monthly expense data
        // - Group expenses by month
        // - Sum amounts per month (handle SPLIT vs INDIVIDUAL)
        
        // Step 4: Calculate monthly profits
        // - For each month: monthlyProfit = monthlyIncome - monthlyExpense
        
        // Step 5: Calculate average monthly profit
        // - averageMonthly = sum of all monthly profits / number of months
        // - Handle cases where no data exists
        
        // Step 6: Return formatted data for Average Monthly Card
        // Return: { averageMonthlyProfit: number }

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Get Monthly Income vs Expense Chart Data
export async function getMonthlyIncomeExpenseChartService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Determine months to show based on filters
        // - If month filter: show last 6 months including selected month
        // - If date range: show months in that range
        // - Default: show current year months (Jan-Dec)
        
        // Step 2: Get monthly income breakdown
        // - Group bookings by month
        // - Sum totalPayableAmount per month
        // - Create array: [{ month: "Jan", income: 450000 }, ...]
        
        // Step 3: Get monthly expense breakdown
        // - Group expenses by month (handle SPLIT vs INDIVIDUAL)
        // - Sum amounts per month
        // - Create array: [{ month: "Jan", expense: 150000 }, ...]
        
        // Step 4: Combine income and expense data
        // - Merge both arrays by month
        // - Ensure all months have both income and expense values (default 0)
        
        // Step 5: Format data for bar chart
        // - Return array for frontend chart component
        // Return: [{ month: "Jan", income: 450000, expense: 150000 }, ...]

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Get Profit Trend Chart Data
export async function getProfitTrendChartService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Get monthly income and expense data
        // - Use getMonthlyIncomeExpenseChartService to get base data
        
        // Step 2: Calculate monthly profits
        // - For each month: profit = income - expense
        
        // Step 3: Format data for line chart
        // - Create array with month and profit values
        // - Handle negative profits (losses)
        
        // Step 4: Calculate trend indicators
        // - Identify growth/decline patterns
        // - Calculate month-over-month changes
        
        // Step 5: Return formatted data for profit trend chart
        // Return: [{ month: "Jan", profit: 300000 }, { month: "Feb", profit: 280000 }, ...]

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Get Villa Performance Data
export async function getVillaPerformanceService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Get all villas or specific villa if villaId provided
        // - If villaId in filters: get only that villa
        // - Else: get all villas from database
        
        // Step 2: For each villa, calculate income
        // - Query bookings for each villa with date filters
        // - Sum totalPayableAmount per villa
        
        // Step 3: For each villa, calculate expenses
        // - Query INDIVIDUAL expenses (direct villa mapping)
        // - Query SPLIT expenses (from ExpenseVilla table)
        // - Sum total expenses per villa
        
        // Step 4: Calculate performance metrics per villa
        // - villaProfit = villaIncome - villaExpenses
        // - profitMargin = (villaProfit / villaIncome) * 100
        
        // Step 5: Sort villas by performance
        // - Sort by profit descending (best performing first)
        
        // Step 6: Format data for villa performance list
        // Return: [{ villaId, villaName, income, profit, profitMargin }, ...]

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Get Expense Breakdown Pie Chart Data
export async function getExpenseBreakdownService(filters: getFinanceQueryParamsData): Promise<any> {
    try {
        // Step 1: Build base query for Expense table with ExpenseCategory join
        
        // Step 2: Apply date and villa filters (same as getTotalExpenseService)
        
        // Step 3: Handle different expense types and calculate amounts by category
        // - For INDIVIDUAL type: use expense.amount directly
        // - For SPLIT type: use ExpenseVilla.amount
        
        // Step 4: Group expenses by category
        // - Group by ExpenseCategory.name
        // - Sum amounts per category
        
        // Step 5: Calculate percentages for pie chart
        // - totalExpenses = sum of all category amounts
        // - For each category: percentage = (categoryAmount / totalExpenses) * 100
        
        // Step 6: Format data for pie chart
        // - Sort categories by amount (largest first)
        // Return: [{ category: "Maintenance", amount: 280000, percentage: 35 }, ...]

    } 
    catch (error) { 
        console.error(error); 
        throw error;
    }
}

// Service to Orchestrate All Dashboard Data
export async function getFinanceDashboardService(queryParams: getFinanceQueryParamsData): Promise<any> {
    try {
        if(queryParams.villaId){
            const villa = await isVillaPresentService({ villaId: queryParams.villaId });

            if(!villa) {
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
        
        if(!totalIncomeData && !totalExpenseData) {
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
}