import type { NextFunction, Request, Response } from "express";
import { getFinanceQueryParamsSchema } from "../validators/data-validators/finance/getFinanceParams.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getFinanceDashboardService } from "../services/finance.services.ts";

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

// Controller to Generate Finance Report
export async function generateFinanceReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {

  }
  catch (error) {
    next(error);
  }
};