import type { NextFunction, Request, Response } from "express";

// Controller to Add a Booking
export async function addBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // validate the data
    // if error send error 
    // extract the body from validated data
    // check if the number of guest is less than or equal to the max capacity of a villa
    // check if the villa is available between that duration of stay (checkin and checkout)
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