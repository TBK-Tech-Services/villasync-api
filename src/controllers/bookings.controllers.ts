import type { NextFunction, Request, Response } from "express";
import { createBookingSchema } from "../validators/data-validators/booking/createBooking.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { isVillaPresentService } from "../services/villas.services.ts";
import { parseBookingDates } from "../utils/booking/parseBookingDates.ts";
import { getTotalDaysOfStay } from "../utils/booking/calculateTotalDaysOfStay.ts";
import { addBookingService, checkIfBookingExistService, checkVillaAvailabilityForUpdateService, checkVillaAvailabilityService, deleteBookingService, getABookingService, getAllBookingsService, searchAndFilterBookingsService, updateBookingService, updateBookingStatusService, updatePaymentStatusService } from "../services/bookings.services.ts";
import { deleteBookingSchema } from "../validators/data-validators/booking/deleteBooking.ts";
import { updateBookingParamsSchema } from "../validators/data-validators/booking/updateBookingParam.ts";
import { updateBookingBodySchema } from "../validators/data-validators/booking/updateBookingBody.ts";
import { getBookingSchema } from "../validators/data-validators/booking/getBooking.ts";
import { searchAndFilterBookingSchema } from "../validators/data-validators/booking/searchAndFilterBooking.ts";
import { updateBookingStatusParamsSchema } from "../validators/data-validators/booking/updateBookingStatusParam.ts";
import { updateBookingStatusBodySchema } from "../validators/data-validators/booking/updateBookingStatusBody.ts";
import { updatePaymentStatusParamsSchema } from "../validators/data-validators/booking/updatePaymentStatusParam.ts";
import { updatePaymentStatusBodySchema } from "../validators/data-validators/booking/updatePaymentStatusBody.ts";

// Controller to Add a Booking
export async function addBooking(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const validationResult = createBookingSchema.safeParse(req.body);
    if(!validationResult.success){
      return sendError(res , "Validation Failed !!!" , 400 , validationResult.error);
    }

    const validatedData = validationResult.data;

    const villa = await isVillaPresentService({villaId : validatedData.villaId});
    if(!villa){
      return sendError(res , "Villa with this id doesnt exist !!!" , 404 , validationResult.error);
    }

    if(!(validatedData.totalGuests <= villa.maxGuests)){
      return sendError(res , "Number of guest exceed the max capacity of a villa !!!" , 400 , validationResult.error);
    }

    const { checkInDate, checkOutDate } = parseBookingDates( validatedData.checkIn , validatedData.checkOut );

    if(!(checkOutDate.getTime() > checkInDate.getTime())){
      return sendError(res, "Checkout date must be after checkin date !!!", 400);
    }

    const today = new Date();
    today.setHours(0 , 0 , 0 , 0);
  
    if(checkInDate.getTime() < today.getTime()){
      return sendError(res, "Checkin date cannot be in the past !!!", 400);
    }

    const totalDaysOfStay = getTotalDaysOfStay(checkInDate , checkOutDate);

    const isVillaAvailable = await checkVillaAvailabilityService({ villaId: validatedData.villaId , checkInDate , checkOutDate });

    if(!isVillaAvailable){
        return sendError(res, "Villa is not available for selected dates !!!", 409);
    }

    let totalGST = 0;
    let totalAmountToPay = 0;
    const subTotal = villa.price * totalDaysOfStay;

    if(validatedData.isGSTIncluded){
      totalGST = (subTotal * 18) / 100;
      totalAmountToPay = subTotal + totalGST;
    }
    else {
      totalGST = 0;
      totalAmountToPay = subTotal + totalGST;
    }

    const formData = {
      guestName: validatedData.guestName,
      guestEmail: validatedData.guestEmail,
      guestPhone: validatedData.guestPhone,
      villaId: validatedData.villaId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalGuests: validatedData.totalGuests,
      specialRequest: validatedData.specialRequest || "",
      subTotalAmount: subTotal,
      isGSTIncluded: validatedData.isGSTIncluded,
      totalTax: totalGST,
      totalPayableAmount: totalAmountToPay  
    }

    const booking = await addBookingService(formData);

    if(!booking){
      return sendError(res, "Error adding a booking !!!", 500);
    }

    return sendSuccess(res , booking , "Successfully Added a Booking..." , 201);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Update a Booking
export async function updateBooking(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = updateBookingParamsSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      return sendError(res, "Invalid booking ID", 400, paramsValidation.error);
    }
    
    const bookingId = paramsValidation.data.id;
    
    const bodyValidation = updateBookingBodySchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return sendError(res, "Validation Failed", 400, bodyValidation.error);
    }
    
    const updatedData = bodyValidation.data;

    const existingBooking = await checkIfBookingExistService(bookingId);
    if (!existingBooking) {
      return sendError(res, "Booking with this id doesn't exist !!!", 404, null);
    }

    if (updatedData.villaId) {
      const villa = await isVillaPresentService({villaId: updatedData.villaId});

      if (!villa) {
        return sendError(res, "Villa with this id doesn't exist !!!", 404, null);
      }

      if ((updatedData.totalGuests) && (updatedData.totalGuests > villa.maxGuests)) {
        return sendError(res, "Number of guest exceed the max capacity of a villa !!!", 400, null);
      }
    }

    let checkInDate, checkOutDate, totalDaysOfStay;

    if (updatedData.checkIn && updatedData.checkOut) {
      const parsedDates = parseBookingDates(updatedData.checkIn, updatedData.checkOut);
      checkInDate = parsedDates.checkInDate;
      checkOutDate = parsedDates.checkOutDate;

      if (!(checkOutDate.getTime() > checkInDate.getTime())) {
        return sendError(res, "Checkout date must be after checkin date !!!", 400);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate.getTime() < today.getTime()) {
        return sendError(res, "Checkin date cannot be in the past !!!", 400);
      }

      totalDaysOfStay = getTotalDaysOfStay(checkInDate, checkOutDate);

      const villaId = updatedData.villaId || existingBooking.villaId;

      const isVillaAvailable = await checkVillaAvailabilityForUpdateService({villaId, checkInDate, checkOutDate,  excludeBookingId: bookingId});

      if (!isVillaAvailable) {
        return sendError(res, "Villa is not available for selected dates !!!", 409);
      }
    }

    let calculatedData = {};
    if (updatedData.villaId || updatedData.checkIn || updatedData.checkOut || updatedData.isGSTIncluded !== undefined) {
      const villa = updatedData.villaId ?
        await isVillaPresentService({villaId: updatedData.villaId})
        : 
        await isVillaPresentService({villaId: existingBooking.villaId});

      if (!villa) {
        return sendError(res, "Villa not found !!!", 404, null);
      };

      const days = totalDaysOfStay || getTotalDaysOfStay( checkInDate || existingBooking.checkIn , checkOutDate || existingBooking.checkOut );

      const subTotal = villa.price * days;

      const isGSTIncluded = (updatedData.isGSTIncluded !== undefined) ?
        updatedData.isGSTIncluded 
        :
        existingBooking.isGSTIncluded;

      let totalGST = 0;
      let totalAmountToPay = 0;

      if (isGSTIncluded) {
        totalGST = (subTotal * 18) / 100;
        totalAmountToPay = subTotal + totalGST;
      } 
      else {
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

    return sendSuccess(res, updatedBooking, "Successfully Updated Booking", 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Update Booking Status
export async function updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = updateBookingStatusParamsSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      return sendError(res, "Invalid booking ID", 400, paramsValidation.error);
    }
    
    const bookingId = paramsValidation.data.id;
    
    const bodyValidation = updateBookingStatusBodySchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return sendError(res, "Validation Failed", 400, bodyValidation.error);
    }
    
    const updatedData = bodyValidation.data;

    const updatedBooking = await updateBookingStatusService({bookingId , updatedData});

    if(updatedBooking === null){
      return sendError(res , "Didnt Get Updated Booking!" , 404 , null);
    }

    return sendSuccess(res , updatedBooking , "Successfully Updated Booking Status!" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Update Payment Status
export async function updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = updatePaymentStatusParamsSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      return sendError(res, "Invalid booking ID", 400, paramsValidation.error);
    }
    
    const bookingId = paramsValidation.data.id;
    
    const bodyValidation = updatePaymentStatusBodySchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return sendError(res, "Validation Failed", 400, bodyValidation.error);
    }
    
    const updatedData = bodyValidation.data;

    const updatedBooking = await updatePaymentStatusService({bookingId , updatedData});

    if(updatedBooking === null){
      return sendError(res , "Didnt Get Updated Booking!" , 404 , null);
    }

    return sendSuccess(res , updatedBooking , "Successfully Updated Payment Status!" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Delete a Booking
export async function deleteBooking(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = deleteBookingSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      return sendError(res, "Invalid Booking ID !!!", 400, paramsValidation.error);
    }
    
    const bookingId = paramsValidation.data.id;

    const bookingExistance = await checkIfBookingExistService(bookingId);

    if(!bookingExistance){
      return sendError(res, "Booking Doesnt Exist !!!", 404, null);
    }

    const deletedBooking = await deleteBookingService(bookingId);

    return sendSuccess(res , deletedBooking , "Successfully Deleted a Booking" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Bookings
export async function getAllBookings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const bookings = await getAllBookingsService();

    if(!bookings){
      return sendError(res , "No Bookings Exist !!!" , 404 , null);
    }

    return sendSuccess(res , bookings , "Successfully Retrieved All Bookings !!!" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get a Booking
export async function getABooking(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = getBookingSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      return sendError(res, "Invalid booking ID", 400, paramsValidation.error);
    }
    
    const bookingId = paramsValidation.data.id;

    const booking = await getABookingService(bookingId);

    if(!booking){
      return sendError(res , "Booking Doesnt Exist !!!" , 404 , null);
    }

    return sendSuccess(res , booking , "Successfully Retrieved A Booking !!!" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Search and Filter Bookings
export async function searchAndFilterBookings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const validationResult = searchAndFilterBookingSchema.safeParse(req.query);
    if(!validationResult.success){
      return sendError(res , "Validation Failed !!!" , 400 , validationResult.error);
    }

    const validatedData = validationResult.data;

    const results = await searchAndFilterBookingsService(validatedData);

    if(!results){
      return sendError(res , "Error Getting Search and Filter Results !!!" , 500 , null);
    }

    return sendSuccess(res , results , "Successfully Retireved Search and Filter Bookings" , 200);
  }
  catch (error) {
    next(error);
  }
}

// Controller to Export Bookings
export async function exportBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}