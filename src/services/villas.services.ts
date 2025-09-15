import type { Villa } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { addVillaData } from "../validators/data-validators/villa/addVilla.ts";

// Service to Check If Villa Already Exist
export async function checkIfVillaExistService(villaName: string): Promise<Villa | null> {
    try {
        const villa = await prisma.villa.findFirst({
            where : {
                name : villaName
            }
        });

        if(!villa){
            return null;
        }

        return villa;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while checking if the villa already exist : ${message}`);
        throw new Error(`Error while checking if the villa already exist : ${message}`);
    }
}

// Service to Add a Villa
export async function addVillaService(validatedData : addVillaData): Promise<Villa | null> {
    try {
        const newVilla = await prisma.villa.create({
            data : {
                name : validatedData.villaName,
                location : validatedData.location,
                bedrooms : validatedData.bedRooms,
                bathrooms : validatedData.bathRooms,
                maxGuests : validatedData.maxGuest,
                price : validatedData.pricePerNight,
                status : validatedData.status,
                description : validatedData.description,
                amenities : {
                    create : validatedData.amenities.map((amenityId) => ({
                        amenity: { 
                            connect: { 
                                id: amenityId 
                            } 
                        }
                    }))
                },
                images: {
                    create: validatedData.images.map((imageUrl) => ({
                        link: imageUrl
                    }))
                }
            },
            include : {
                amenities : true,
                images : true
            }
        });

        return newVilla;
    } 
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error while creating a villa : ${message}`);
        throw new Error(`Error while creating a villa : ${message}`);
    }
}

// Service to Update a Villa
export async function updateVillaService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to get All Villas
export async function getAllVillasService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
    
// Service to get a Single Villa
export async function getSingleVillaService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
    
// Service to get Recent Bookings of a Villa
export async function getVillaRecentBookingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to get Monthly Revenue of a Villa
export async function getVillaMonthlyRevenueService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to get Availability of a Villa
export async function getVillaAvailabilityService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}