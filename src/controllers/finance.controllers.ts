import type { NextFunction, Request, Response } from "express";
import { getFinanceQueryParamsSchema } from "../validators/data-validators/finance/getFinanceParams.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { calculateFinancialMetrics, calculateMonthlyTrends, calculateVillaPerformance, generateFinanceReportPDF, getBookingsInRange, getExpensesInRange, getFinanceDashboardService, getNetRevenueDashboardService } from "../services/finance.services.ts";

// Update controller to validate query params
export async function getFinanceDashboard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const validatedParams = getFinanceQueryParamsSchema.parse(req.query);

    const financeDashboardData = await getFinanceDashboardService(validatedParams);

    if (financeDashboardData === null) {
      return sendError(res, "Didnt Get Data For Finance Dashboard!", 404, null);
    }

    return sendSuccess(res, financeDashboardData, "Successfully Got Data For Finance Dashboard!", 200);
  }
  catch (error) {
    next(error);
  }
}

// Controller to Get Net Revenue Dashboard
export async function getNetRevenueDashboard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const validatedParams = getFinanceQueryParamsSchema.parse(req.query);
    const data = await getNetRevenueDashboardService(validatedParams);
    return sendSuccess(res, data, "Successfully got net revenue data", 200);
  }
  catch (error) {
    next(error);
  }
}

// Controller to Generate Finance Report
export async function generateFinanceReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    // Parse filters from query params
    const validatedParams = getFinanceQueryParamsSchema.parse(req.query);

    // Fetch bookings and expenses in range
    const bookings = await getBookingsInRange(validatedParams);
    const expenses = await getExpensesInRange(validatedParams);

    if ((!bookings || bookings.length === 0) && (!expenses || expenses.length === 0)) {
      return sendError(res, "No financial data found for the given filters", 404, null);
    }

    // Calculate financial metrics
    const financialMetrics = await calculateFinancialMetrics(bookings, expenses);

    // Calculate villa-wise performance
    const villaPerformance = await calculateVillaPerformance(bookings, expenses);

    // Calculate monthly trends
    const monthlyTrends = await calculateMonthlyTrends(bookings, expenses, validatedParams);

    // Generate PDF
    const pdfBuffer = await generateFinanceReportPDF({
      filters: validatedParams,
      bookings,
      expenses,
      financialMetrics,
      villaPerformance,
      monthlyTrends
    });

    if (!pdfBuffer) {
      return sendError(res, "Failed to generate finance report PDF", 500, null);
    }

    // Set response headers
    const filename = `Finance_Report_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send PDF
    res.send(pdfBuffer);
  }
  catch (error) {
    next(error);
  }
}