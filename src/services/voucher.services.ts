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