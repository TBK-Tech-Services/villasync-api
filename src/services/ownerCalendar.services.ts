import prisma from "../db/DB.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to get owner calendar bookings
export async function getOwnerCalendarBookingsService(data: {
    ownerId: number;
    month: number;
    year: number;
    villaId?: number;
}) {
    try {
        const { ownerId, month, year, villaId } = data;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Get owner's villa IDs first
        const ownerVillas = await prisma.villa.findMany({
            where: { ownerId },
            select: { id: true, name: true }
        });

        const ownerVillaIds = ownerVillas.map(v => v.id);

        if (ownerVillaIds.length === 0) return [];

        // Ensure villaId belongs to owner
        if (villaId && !ownerVillaIds.includes(villaId)) return [];

        const where: any = {
            villaId: villaId ? villaId : { in: ownerVillaIds },
            bookingStatus: { in: ['CONFIRMED', 'CHECKED_IN'] },
            OR: [
                { AND: [{ checkIn: { gte: startDate } }, { checkIn: { lte: endDate } }] },
                { AND: [{ checkOut: { gte: startDate } }, { checkOut: { lte: endDate } }] },
                { AND: [{ checkIn: { lte: startDate } }, { checkOut: { gte: endDate } }] }
            ]
        };

        const bookings = await prisma.booking.findMany({
            where,
            select: {
                id: true,
                villaId: true,
                checkIn: true,
                checkOut: true,
                villa: { select: { name: true } }
            },
            orderBy: { checkIn: 'asc' }
        });

        return bookings.map(b => ({
            id: b.id.toString(),
            villaId: b.villaId.toString(),
            villaName: b.villa.name,
            checkIn: b.checkIn.toISOString().split('T')[0],
            checkOut: b.checkOut.toISOString().split('T')[0]
        }));
    } catch (error) {
        console.error(`Error fetching owner calendar bookings: ${error}`);
        throw new InternalServerError("Failed to fetch owner calendar bookings");
    }
}

// Service to get owner villas
export async function getOwnerVillasService(ownerId: number) {
    try {
        const villas = await prisma.villa.findMany({
            where: { ownerId },
            select: {
                id: true,
                name: true
            },
            orderBy: { name: 'asc' }
        });

        return villas;
    } catch (error) {
        console.error(`Error fetching owner villas: ${error}`);
        throw new InternalServerError("Failed to fetch owner villas");
    }
}