import type { NextFunction, Request, Response } from "express";
import { createBookingSchema } from "../validators/data-validators/booking/createBooking.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { isVillaPresentService } from "../services/villas.services.ts";
import { parseBookingDates } from "../utils/booking/parseBookingDates.ts";
import { getTotalDaysOfStay } from "../utils/booking/calculateTotalDaysOfStay.ts";
import { addBookingService, checkVillaAvailabilityService } from "../services/bookings.services.ts";

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

// Controller to get All Bookings
export async function getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Update a Booking
export async function updateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Delete a Booking
export async function deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
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