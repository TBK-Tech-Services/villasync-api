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
export async function getTotalRevenueService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
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
export async function getPendingBookingsCountService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Get Count of Cancellations
export async function getCancellationsCountService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
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
            include : {
                villa : true
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
export async function getTodaysCheckinsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Get Tommorows Checkins
export async function getTomorrowsCheckinsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Get Weeks Checkins
export async function getWeeksCheckinsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
 
// Service to Get This Month Revenue
export async function getThisMonthRevenueService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
 
// Service to Get Last Month Revenue
export async function getLastMonthRevenueService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Get Average Daily Revenue
export async function getAverageDailyRevenueService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Get Monthly growth Rate
export async function getMonthlyGrowthRateService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to Get All Villas Occupancy
export async function getAllVillasOccupancyService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}