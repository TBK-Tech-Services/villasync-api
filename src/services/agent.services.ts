import prisma from "../db/DB.ts";
import type { FilterVillasData } from "../validators/data-validators/agent/filterVillas.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to get All Villas For Landing Page
export async function filterVillasForLandingService(updatedData: FilterVillasData): Promise<any[] | null> {
    try {
        let where: any = {};

        let include: any = {
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

        // Filter by guests
        if (updatedData.guests) {
            where.maxGuests = {
                gte: updatedData.guests
            }
        }

        // Filter by bedrooms
        if (updatedData.bedrooms) {
            where.bedrooms = {
                gte: updatedData.bedrooms
            }
        }

        // Filter by availability (check-in and check-out dates)
        if (updatedData.checkIn && updatedData.checkOut) {
            where.bookings = {
                none: {
                    AND: [
                        {
                            checkIn: {
                                lt: new Date(updatedData.checkOut),
                            }
                        },
                        {
                            checkOut: {
                                gt: new Date(updatedData.checkIn),
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
            where: where,
            include: include
        });

        if (!villas || villas.length === 0) {
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
            brochureUrl: villa.brochureUrl,

            // ✅ Use imageUrl directly from Villa model
            images: villa.imageUrl ? [villa.imageUrl] : [],  // Array with single image
            image: villa.imageUrl || '',  // Single image for card display

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
        console.error(`Error filtering villas: ${error}`);
        throw new InternalServerError("Failed to filter villas");
    }
}

// Service to get All Amenities For Landing Page
export async function getAllAmmenitiesService(): Promise<any[] | null> {
    try {
        const amenities = await prisma.amenity.findMany();

        return amenities;
    }
    catch (error) {
        console.error(`Error fetching amenities: ${error}`);
        throw new InternalServerError("Failed to fetch amenities");
    }
}