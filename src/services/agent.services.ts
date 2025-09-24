import prisma from "../db/DB.ts";
import type { FilterVillasData } from "../validators/data-validators/agent/filterVillas.ts";

// Service to get All Villas For Landing Page
export async function filterVillasForLandingService(updatedData: FilterVillasData): Promise<any[] | null> {
    try {
        let where: any = {};

        let include: any = {
            images: true,
            amenities: {
                include: {
                    amenity: {
                        include: {
                            category: true
                        }
                    }
                }
            },
            bookings: {
                select: {
                    checkIn: true,
                    checkOut: true,
                    bookingStatus: true
                }
            }
        };
        
        if(updatedData.guests){
            where.maxGuests = {
                gte: updatedData.guests
            }
        }
        
        if(updatedData.amenities && updatedData.amenities.length > 0){
            where.amenities = {
                some : {
                    amenityId: {
                        in: updatedData.amenities
                    }
                }
            }
        }
        
        if (updatedData.checkIn && updatedData.checkOut) {
            where.bookings = {
                none: {
                    AND: [
                        {
                            checkIn: {
                                lt: updatedData.checkOut
                            }
                        },
                        {
                            checkOut: {
                                gt: updatedData.checkIn
                            }
                        },
                        {
                            bookingStatus: {
                                not: "CANCELLED"
                            }
                        }
                    ]
                }
            };
        }
        
        const villas = await prisma.villa.findMany({
            where : where,
            include : include
        });
        
        if(!villas || villas.length === 0){
            return null;
        }

        const transformedVillas = villas.map(villa => ({
            id: villa.id,
            name: villa.name,
            location: villa.location,
            price: villa.price,
            maxGuests: villa.maxGuests,
            bedrooms: villa.bedrooms,
            bathrooms: villa.bathrooms,
            description: villa.description,
            status: villa.status,
            
            images: (villa.images as any[])?.map((img: any) => img.link) || [],
            image: (villa.images as any[])?.[0]?.link || '', 
            
            amenities: (villa.amenities as any[])?.map((va: any) => ({
                id: va.amenity.id,
                name: va.amenity.name,
                category: {
                    id: va.amenity.category.id,
                    name: va.amenity.category.name
                }
            })) || [],
            
            bookedDates: (villa.bookings as any[])
                ?.filter((booking: any) => booking.bookingStatus !== 'CANCELLED')
                ?.map((booking: any) => ({
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut
                })) || []
        }));

        return transformedVillas;
        
    } catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error while filtering villas : ${message}`);
        throw new Error(`Error while filtering villas : ${message}`);
    }
}