import type { Villa } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { addVillaData } from "../validators/data-validators/villa/addVilla.ts";
import type { updateVillaBodyData } from "../validators/data-validators/villa/updateVillaBody.ts";

// Service to Check If Villa Already Exist By VillaID
export async function isVillaPresentService({ villaId }: {villaId : number} ): Promise<Villa | null> {
    try {
        const villa = await prisma.villa.findUnique({
            where : {
                id : villaId
            }
        });

        if(!villa){
            return null;
        }

        return villa;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while checking villa existance : ${message}`);
        throw new Error(`Error while checking villa existance : ${message}`);
    }
}

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

// Service to get All Villas
export async function getAllVillasService(): Promise<Villa[] | null> {
    try {
        const villas = await prisma.villa.findMany({
            include: {
                amenities: {
                    include: {
                        amenity: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                images: true
            }
        });

        return villas;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting all villas : ${message}`);
        throw new Error(`Error while getting all villas : ${message}`);
    }
}

// Service to get All Amenities Categories
export async function getAllAmenityCategoriesService() {
    try {
        const amenitiesCategories = await prisma.amenityCategory.findMany({
            include: {
                amenities: {
                    orderBy: { 
                        name: 'asc'
                    }
                }
            },
            orderBy: { 
                name: 'asc' 
            },
        });

        return amenitiesCategories;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting all amenities categories : ${message}`);
        throw new Error(`Error while getting all amenities categories : ${message}`);
    }
}
    
// Service to get a Single Villa
export async function getSingleVillaService(villaId : number): Promise<Villa | null> {
    try {
        const villa = await prisma.villa.findUnique({
            where : {
                id : villaId
            },
            include: {
                amenities: {
                    include: {
                        amenity: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                images: true
            }
        });

        return villa;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting a villa : ${message}`);
        throw new Error(`Error while getting a villa : ${message}`);
    }
}

// Service to Update a Villa
export async function updateVillaService(villaId: number, updateData: updateVillaBodyData): Promise<Villa | null> {
    try {
        const villaUpdateData: any = {};
        
        if (updateData.villaName !== undefined){
            villaUpdateData.name = updateData.villaName;
        };
        if (updateData.location !== undefined){
            villaUpdateData.location = updateData.location;
        };
        if (updateData.bedRooms !== undefined){
            villaUpdateData.bedrooms = updateData.bedRooms;
        };
        if (updateData.bathRooms !== undefined){
            villaUpdateData.bathrooms = updateData.bathRooms;
        };
        if (updateData.maxGuest !== undefined){
            villaUpdateData.maxGuests = updateData.maxGuest;
        };
        if (updateData.pricePerNight !== undefined){
            villaUpdateData.price = updateData.pricePerNight;
        };
        if (updateData.status !== undefined){
            villaUpdateData.status = updateData.status;
        };
        if (updateData.description !== undefined){
            villaUpdateData.description = updateData.description;
        };

        const updatedVilla = await prisma.villa.update({
            where: {
                id: villaId
            },
            data: {
                ...villaUpdateData,

                ...((updateData.amenities !== undefined) 
                    && 
                    {
                        amenities: {
                            deleteMany: {},
                            create: updateData.amenities.map((amenityId) => ({
                                amenityId
                            }))
                        }
                    }),

                ...((updateData.images !== undefined) 
                    && 
                    {
                        images: {
                            deleteMany: {},
                            create: updateData.images.map((imageUrl) => ({
                                link: imageUrl
                            }))
                        }
                    })
            },
            include: {
                amenities: {
                    include: {
                        amenity: {
                            include: {
                                category: true
                            }
                        }
                    }
                },
                images: true
            }
        });

        return updatedVilla;
    } 
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error while updating villa: ${message}`);
        throw new Error(`Error while updating villa: ${message}`);
    }
}

// Service to Delete a Villa
export async function deleteVillaService(villaId: number): Promise<Villa | null> {
    try {
        const deletedVilla = await prisma.villa.delete({
            where : {
                id : villaId
            }
        })

        return deletedVilla;
    }
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error while deleting a villa: ${message}`);
        throw new Error(`Error while deleting a villa: ${message}`);
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