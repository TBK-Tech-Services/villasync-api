import type { NextFunction, Request, Response } from "express";
import { createBookingSchema } from "../validators/data-validators/booking/createBooking.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { isVillaPresentService } from "../services/villas.services.ts";
import { parseBookingDates } from "../utils/booking/parseBookingDates.ts";
import { getTotalDaysOfStay } from "../utils/booking/calculateTotalDaysOfStay.ts";
import { addBookingService, checkIfBookingExistService, checkVillaAvailabilityForUpdateService, checkVillaAvailabilityService, createBookingWithSheetSync, deleteBookingService, formatBookingsForCSV, getABookingService, getAllBookingsService, getCalendarBookingsService, searchAndFilterBookingsService, sendVoucherToAdminsService, updateBookingService, updateBookingStatusService, updatePaymentStatusService, updateVoucherApprovalService } from "../services/bookings.services.ts";
import { deleteBookingSchema } from "../validators/data-validators/booking/deleteBooking.ts";
import { updateBookingParamsSchema } from "../validators/data-validators/booking/updateBookingParam.ts";
import { updateBookingBodySchema } from "../validators/data-validators/booking/updateBookingBody.ts";
import { getBookingSchema } from "../validators/data-validators/booking/getBooking.ts";
import { searchAndFilterBookingSchema } from "../validators/data-validators/booking/searchAndFilterBooking.ts";
import { updateBookingStatusParamsSchema } from "../validators/data-validators/booking/updateBookingStatusParam.ts";
import { updateBookingStatusBodySchema } from "../validators/data-validators/booking/updateBookingStatusBody.ts";
import { updatePaymentStatusParamsSchema } from "../validators/data-validators/booking/updatePaymentStatusParam.ts";
import { updatePaymentStatusBodySchema } from "../validators/data-validators/booking/updatePaymentStatusBody.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { ValidationError, NotFoundError, ConflictError, InternalServerError } from "../utils/errors/customErrors.ts";
import type { Booking_Data } from "../types/booking/bookingData.ts";
import { Booking_Status, Payment_Status } from "@prisma/client";
import { generateVoucherSchema } from "../validators/data-validators/automation/voucher.ts";
import { generateVoucherService } from "../services/automation.services.ts";
import { sendVoucherEmailSchema } from "../validators/data-validators/automation/email.ts";
import { sendVoucherEmailService } from "../services/email.services.ts";
import { generateCSV } from "../utils/csv/csvGenerator.ts";
import { getCalendarBookingsSchema } from "../validators/data-validators/booking/getBookingAvailability.ts";
import { sendVoucherWhatsappSchema } from "../validators/data-validators/automation/whatsapp.ts";
import { sendVoucherWhatsAppService } from "../services/whatsapp.services.ts";
import { sendVoucherToAdminsParamsSchema } from "../validators/data-validators/booking/sendVoucherToAdmins.ts";
import { updateVoucherApprovalBodySchema, updateVoucherApprovalParamsSchema } from "../validators/data-validators/booking/updateVoucherApproval.ts";

// Controller to Add a Booking
export const addBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validationResult = createBookingSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw validationResult.error;
  };

  const validatedData = validationResult.data;

  const villa = await isVillaPresentService({ villaId: validatedData.villaId });
  if (!villa) {
    throw new NotFoundError("Villa with this ID does not exist");
  };

  if (validatedData.totalGuests > villa.maxGuests) {
    throw new ValidationError(`Number of guests (${validatedData.totalGuests}) exceeds villa's maximum capacity (${villa.maxGuests})`);
  };

  const { checkInDate, checkOutDate } = parseBookingDates(validatedData.checkIn, validatedData.checkOut);
  if (checkOutDate.getTime() <= checkInDate.getTime()) {
    throw new ValidationError("Check-out date must be after check-in date");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkInDate.getTime() < today.getTime()) {
    throw new ValidationError("Check-in date cannot be in the past");
  };

  const numberOfNights = getTotalDaysOfStay(checkInDate, checkOutDate);
  const basePrice = (villa.price * numberOfNights);
  const customPriceValue = (validatedData.customPrice || 0);
  const effectivePrice = ((customPriceValue > 0) ? customPriceValue : basePrice);
  const extraPersonCharge = (validatedData.extraPersonCharge || 0);
  const discount = (validatedData.discount || 0);
  const subTotalAmount = (effectivePrice + extraPersonCharge - discount);
  const totalTax = (validatedData.isGSTIncluded ? (subTotalAmount * 0.18) : 0);
  const totalPayableAmount = (subTotalAmount + totalTax);
  const advancePaid = (validatedData.advancePaid || 0);
  const dueAmount = (totalPayableAmount - advancePaid);
  const paymentStatus: Payment_Status = (dueAmount <= 0) ? Payment_Status.PAID : Payment_Status.PENDING;

  const bookingData: Booking_Data = {
    guestName: validatedData.guestName,
    guestEmail: validatedData.guestEmail || null,
    guestPhone: validatedData.guestPhone,
    alternatePhone: validatedData.alternatePhone || null,
    villaId: validatedData.villaId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalGuests: validatedData.totalGuests,
    numberOfNights,
    specialRequest: validatedData.specialRequest || null,
    bookingStatus: Booking_Status.CONFIRMED,
    paymentStatus,
    basePrice,
    customPrice: customPriceValue > 0 ? customPriceValue : null,
    extraPersonCharge,
    discount,
    subTotalAmount,
    isGSTIncluded: validatedData.isGSTIncluded,
    totalTax,
    totalPayableAmount,
    advancePaid,
    dueAmount
  };

  const villaName = villa.name;

  const booking = await createBookingWithSheetSync(bookingData, villaName);

  sendSuccess(res, booking, "Booking created successfully", 201);
});

// Controller to Update a Booking
export const updateBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = updateBookingParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new ValidationError("Invalid booking ID format");
  }

  const bookingId = paramsValidation.data.id;

  const bodyValidation = updateBookingBodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    throw bodyValidation.error;
  }

  const updatedData = bodyValidation.data;

  const existingBooking = await checkIfBookingExistService(bookingId);
  if (!existingBooking) {
    throw new NotFoundError("Booking with this ID does not exist");
  }

  if (updatedData.villaId) {
    const villa = await isVillaPresentService({ villaId: updatedData.villaId });

    if (!villa) {
      throw new NotFoundError("Villa with this ID does not exist");
    }

    if (updatedData.totalGuests && updatedData.totalGuests > villa.maxGuests) {
      throw new ValidationError(`Number of guests (${updatedData.totalGuests}) exceeds villa's maximum capacity (${villa.maxGuests})`);
    }
  }

  let checkInDate, checkOutDate, totalDaysOfStay;

  if (updatedData.checkIn && updatedData.checkOut) {
    const parsedDates = parseBookingDates(updatedData.checkIn, updatedData.checkOut);
    checkInDate = parsedDates.checkInDate;
    checkOutDate = parsedDates.checkOutDate;

    if (checkOutDate.getTime() <= checkInDate.getTime()) {
      throw new ValidationError("Check-out date must be after check-in date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate.getTime() < today.getTime()) {
      throw new ValidationError("Check-in date cannot be in the past");
    }

    totalDaysOfStay = getTotalDaysOfStay(checkInDate, checkOutDate);

    const villaId = updatedData.villaId || existingBooking.villaId;

    const isVillaAvailable = await checkVillaAvailabilityForUpdateService({
      villaId,
      checkInDate,
      checkOutDate,
      excludeBookingId: bookingId
    });

    if (!isVillaAvailable) {
      throw new ConflictError("Villa is not available for the selected dates");
    }
  }

  let calculatedData = {};
  if (updatedData.villaId || updatedData.checkIn || updatedData.checkOut || updatedData.isGSTIncluded !== undefined) {
    const villa = updatedData.villaId ?
      await isVillaPresentService({ villaId: updatedData.villaId }) :
      await isVillaPresentService({ villaId: existingBooking.villaId });

    if (!villa) {
      throw new NotFoundError("Villa not found");
    }

    const days = totalDaysOfStay || getTotalDaysOfStay(
      checkInDate || existingBooking.checkIn,
      checkOutDate || existingBooking.checkOut
    );

    const subTotal = villa.price * days;

    const isGSTIncluded = (updatedData.isGSTIncluded !== undefined) ?
      updatedData.isGSTIncluded :
      existingBooking.isGSTIncluded;

    let totalGST = 0;
    let totalAmountToPay = 0;

    if (isGSTIncluded) {
      totalGST = (subTotal * 18) / 100;
      totalAmountToPay = subTotal + totalGST;
    } else {
      totalGST = 0;
      totalAmountToPay = subTotal;
    }

    calculatedData = {
      subTotalAmount: subTotal,
      totalTax: totalGST,
      totalPayableAmount: totalAmountToPay
    };
  }

  const finalUpdateData = {
    ...updatedData,
    ...calculatedData,
    checkIn: checkInDate,
    checkOut: checkOutDate
  };

  const updatedBooking = await updateBookingService(bookingId, finalUpdateData);

  sendSuccess(res, updatedBooking, "Booking updated successfully", 200);
});

// Controller to Update Booking Status
export const updateBookingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = updateBookingStatusParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new ValidationError("Invalid booking ID format");
  }

  const bookingId = paramsValidation.data.id;

  const bodyValidation = updateBookingStatusBodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    throw bodyValidation.error;
  }

  const updatedData = bodyValidation.data;

  // Check if booking exists
  const existingBooking = await checkIfBookingExistService(bookingId);
  if (!existingBooking) {
    throw new NotFoundError("Booking with this ID does not exist");
  }

  const updatedBooking = await updateBookingStatusService({ bookingId, updatedData });

  if (!updatedBooking) {
    throw new InternalServerError("Failed to update booking status");
  }

  sendSuccess(res, updatedBooking, "Booking status updated successfully", 200);
});

// Controller to Update Payment Status
export const updatePaymentStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = updatePaymentStatusParamsSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new ValidationError("Invalid booking ID format");
  }

  const bookingId = paramsValidation.data.id;

  const bodyValidation = updatePaymentStatusBodySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    throw bodyValidation.error;
  }

  const updatedData = bodyValidation.data;

  // Check if booking exists
  const existingBooking = await checkIfBookingExistService(bookingId);
  if (!existingBooking) {
    throw new NotFoundError("Booking with this ID does not exist");
  }

  const updatedBooking = await updatePaymentStatusService({ bookingId, updatedData });

  if (!updatedBooking) {
    throw new InternalServerError("Failed to update payment status");
  }

  sendSuccess(res, updatedBooking, "Payment status updated successfully", 200);
});

// Controller to Delete a Booking
export const deleteBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = deleteBookingSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new ValidationError("Invalid booking ID format");
  }

  const bookingId = paramsValidation.data.id;

  const bookingExistence = await checkIfBookingExistService(bookingId);
  if (!bookingExistence) {
    throw new NotFoundError("Booking with this ID does not exist");
  }

  const deletedBooking = await deleteBookingService(bookingId);

  sendSuccess(res, deletedBooking, "Booking deleted successfully", 200);
});

// Controller to get All Bookings
export const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const bookings = await getAllBookingsService();

  if (!bookings || bookings.length === 0) {
    throw new NotFoundError("No bookings found");
  }

  sendSuccess(res, bookings, "All bookings retrieved successfully", 200);
});

// Controller to get a Booking
export const getABooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = getBookingSchema.safeParse(req.params);
  if (!paramsValidation.success) {
    throw new ValidationError("Invalid booking ID format");
  }

  const bookingId = paramsValidation.data.id;

  const booking = await getABookingService(bookingId);

  if (!booking) {
    throw new NotFoundError("Booking with this ID does not exist");
  }

  sendSuccess(res, booking, "Booking retrieved successfully", 200);
});

// Controller to Search and Filter Bookings
export const searchAndFilterBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validationResult = searchAndFilterBookingSchema.safeParse(req.query);
  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  const results = await searchAndFilterBookingsService(validatedData);

  if (!results) {
    throw new InternalServerError("Failed to search and filter bookings");
  }

  sendSuccess(res, results, "Search and filter results retrieved successfully", 200);
});

// Controller to Generate Booking Voucher
export const generateVoucher = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Validate bookingId from params
  const { bookingId } = req.params;

  const validationResult = generateVoucherSchema.safeParse({ bookingId });

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  // Generate voucher
  const result = await generateVoucherService(validatedData);

  if (!result) {
    throw new InternalServerError("Failed to generate voucher");
  }

  // Success response
  sendSuccess(res, result, "Voucher generated successfully", 200);
});

// Controller to Export Bookings
export const exportBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Validate query parameters
  const validationResult = searchAndFilterBookingSchema.safeParse(req.query);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const { searchText, bookingStatus, paymentStatus, checkInDate } = validationResult.data;

  // Get filtered bookings instead of all bookings
  let bookings;

  if (searchText || bookingStatus || paymentStatus || checkInDate) {
    // Use search/filter logic - data is already validated
    bookings = await searchAndFilterBookingsService({
      searchText,
      bookingStatus,
      paymentStatus,
      checkInDate
    });
  } else {
    // No filters - get all bookings
    bookings = await getAllBookingsService();
  }

  if (!bookings || bookings.length === 0) {
    throw new NotFoundError("No bookings found to export");
  }

  // Format bookings for CSV
  const formattedData = await formatBookingsForCSV(bookings);

  // Generate CSV string
  const csvString = generateCSV(formattedData);

  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvString;

  // Set response headers
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="TBK_Bookings_${Date.now()}.csv"`);

  // Send CSV file
  res.send(csvWithBOM);
});

// Controller to Get Calendar Bookings
export const getCalendarBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validationResult = getCalendarBookingsSchema.safeParse(req.query);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  const bookings = await getCalendarBookingsService(validatedData);

  if (!bookings || bookings.length === 0) {
    return sendSuccess(res, [], "No bookings found for this period", 200);
  }

  sendSuccess(res, bookings, "Calendar bookings retrieved successfully", 200);
});

// Controller to Send Booking Voucher through Email
export const sendVoucherEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Extract bookingId from params
  const { bookingId } = req.params;

  // Check if bookingId exists
  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID is required'
    });
  }

  // Validate request body
  const validationResult = sendVoucherEmailSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  // Send voucher email - Now bookingId is guaranteed to be string
  const result = await sendVoucherEmailService(bookingId, validatedData);

  if (!result) {
    throw new InternalServerError("Failed to send voucher email");
  }

  // Success response
  sendSuccess(res, result, "Voucher sent via email successfully", 200);
});

// Controller to Send Booking Voucher through WhatsApp
export const sendVoucherWhatsApp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Extract bookingId from params
  const { bookingId } = req.params;

  // Check if bookingId exists
  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID is required'
    });
  }

  // Validate request body
  const validationResult = sendVoucherWhatsappSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  // Send voucher via WhatsApp
  const result = await sendVoucherWhatsAppService(bookingId, validatedData);

  if (!result) {
    throw new InternalServerError("Failed to send voucher via WhatsApp");
  }

  // Success response
  sendSuccess(res, result, "Voucher sent via WhatsApp successfully", 200);
});

// Controller to Send Booking Voucher to Admins
export const sendVoucherToAdmins = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;

  const validation = sendVoucherToAdminsParamsSchema.safeParse({ bookingId });
  if (!validation.success) {
    throw new ValidationError("Invalid booking ID");
  }

  const bookingIdNum = parseInt(validation.data.bookingId);

  const booking = await checkIfBookingExistService(bookingIdNum);

  if (!booking) {
    throw new NotFoundError("Booking not found");
  };

  const result = await sendVoucherToAdminsService(bookingIdNum);

  sendSuccess(res, result, "Voucher sent to admins successfully", 200);
});

// Controller to Update Booking Voucher Approval
export const updateVoucherApproval = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = updateVoucherApprovalParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid booking ID");
  };

  const bodyValidation = updateVoucherApprovalBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    throw bodyValidation.error;
  };

  const bookingId = paramsValidation.data.id;
  const { approvedBy } = bodyValidation.data;
  const booking = await checkIfBookingExistService(bookingId);

  if (!booking) {
    throw new NotFoundError("Booking not found");
  };

  const updatedBooking = await updateVoucherApprovalService(bookingId, approvedBy);

  sendSuccess(res, updatedBooking, "Voucher approval updated successfully", 200);
});