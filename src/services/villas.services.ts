import type { Booking, Villa } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { addVillaData } from "../validators/data-validators/villa/addVilla.ts";
import type { updateVillaBodyData } from "../validators/data-validators/villa/updateVillaBody.ts";
import { NotFoundError, InternalServerError, ConflictError } from "../utils/errors/customErrors.ts";

// Service to Check If Villa Already Exist By VillaID
export async function isVillaPresentService({ villaId }: { villaId: number }): Promise<Villa | null> {
    try {
        const villa = await prisma.villa.findUnique({
            where: {
                id: villaId
            }
        });

        return villa;
    }
    catch (error) {
        console.error(`Error checking villa existence: ${error}`);
        throw new InternalServerError("Failed to verify villa existence");
    }
}

// Service to Check If Villa Already Exist by Name
export async function checkIfVillaExistService(villaName: string): Promise<Villa | null> {
    try {
        const villa = await prisma.villa.findFirst({
            where: {
                name: villaName
            }
        });

        return villa;
    }
    catch (error) {
        console.error(`Error checking villa name availability: ${error}`);
        throw new InternalServerError("Failed to check villa name availability");
    }
}

// Service to Add a Villa
export async function addVillaService(validatedData: addVillaData): Promise<Villa | null> {
    try {
        const newVilla = await prisma.villa.create({
            data: {
                name: validatedData.villaName,
                location: validatedData.location,
                bedrooms: validatedData.bedRooms,
                bathrooms: validatedData.bathRooms,
                status: validatedData.status,
                description: validatedData.description,
                imageUrl: validatedData.imageUrl,
                amenities: {
                    create: validatedData.amenities.map((amenityId) => ({
                        amenity: {
                            connect: {
                                id: amenityId
                            }
                        }
                    }))
                },
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
            }
        });

        return newVilla;
    }
    catch (error) {
        // Handle foreign key constraint errors (invalid amenity IDs)
        if (error.code === 'P2025') {
            throw new NotFoundError("One or more amenity IDs are invalid");
        }
        console.error(`Error creating villa: ${error}`);
        throw new InternalServerError("Failed to create villa");
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return villas;
    }
    catch (error) {
        console.error(`Error fetching all villas: ${error}`);
        throw new InternalServerError("Failed to fetch villas");
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
        console.error(`Error fetching amenity categories: ${error}`);
        throw new InternalServerError("Failed to fetch amenity categories");
    }
}

// Service to get a Single Villa
export async function getSingleVillaService(villaId: number): Promise<Villa | null> {
    try {
        const villa = await prisma.villa.findUnique({
            where: {
                id: villaId
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
                images: true,
                managers: true,
                caretakers: true,
            }
        });

        return villa;
    }
    catch (error) {
        console.error(`Error fetching villa details: ${error}`);
        throw new InternalServerError("Failed to fetch villa details");
    }
};

// Service to Update a Villa
export async function updateVillaService(villaId: number, updateData: updateVillaBodyData): Promise<Villa | null> {
    try {
        const villaUpdateData: any = {};

        if (updateData.villaName !== undefined) {
            villaUpdateData.name = updateData.villaName;
        }
        if (updateData.location !== undefined) {
            villaUpdateData.location = updateData.location;
        }
        if (updateData.bedRooms !== undefined) {
            villaUpdateData.bedrooms = updateData.bedRooms;
        }
        if (updateData.bathRooms !== undefined) {
            villaUpdateData.bathrooms = updateData.bathRooms;
        }
        if (updateData.status !== undefined) {
            villaUpdateData.status = updateData.status;
        }
        if (updateData.description !== undefined) {
            villaUpdateData.description = updateData.description;
        }
        if (updateData.imageUrl !== undefined) {
            villaUpdateData.imageUrl = updateData.imageUrl;
        }

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
            }
        });

        return updatedVilla;
    }
    catch (error) {
        // Handle record not found
        if (error.code === 'P2025') {
            throw new NotFoundError("Villa not found");
        }

        // Handle foreign key constraint errors (invalid amenity IDs)
        if (error.code === 'P2003') {
            throw new NotFoundError("One or more amenity IDs are invalid");
        }

        console.error(`Error updating villa: ${error}`);
        throw new InternalServerError("Failed to update villa");
    }
}

// Service to Delete a Villa
export async function deleteVillaService(villaId: number): Promise<Villa | null> {
    try {
        const deletedVilla = await prisma.villa.delete({
            where: {
                id: villaId
            }
        });

        return deletedVilla;
    }
    catch (error) {
        // Handle record not found
        if (error.code === 'P2025') {
            throw new NotFoundError("Villa not found");
        }

        // Handle foreign key constraint (villa has bookings)
        if (error.code === 'P2003') {
            throw new ConflictError("Cannot delete villa as it has associated bookings");
        }

        console.error(`Error deleting villa: ${error}`);
        throw new InternalServerError("Failed to delete villa");
    }
}

// Service to get Recent Bookings of a Villa
export async function getVillaRecentBookingsService(villaId: number): Promise<Booking[] | null> {
    try {
        const villa = await prisma.villa.findUnique({
            where: {
                id: villaId
            },
            include: {
                bookings: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                }
            }
        });

        return villa?.bookings || [];
    }
    catch (error) {
        console.error(`Error fetching villa recent bookings: ${error}`);
        throw new InternalServerError("Failed to fetch villa recent bookings");
    }
}

// Service to get All Bookings of a Villa
export async function getVillaBookingsService(villaId: number): Promise<Booking[] | null> {
    try {
        const villa = await prisma.villa.findUnique({
            where: {
                id: villaId
            },
            include: {
                bookings: {
                    orderBy: {
                        checkIn: 'desc'
                    }
                }
            }
        });

        return villa?.bookings || [];
    }
    catch (error) {
        console.error(`Error fetching villa bookings: ${error}`);
        throw new InternalServerError("Failed to fetch villa bookings");
    }
}

// Service to get Villa KPI Stats
export async function getVillaStatsService(villaId: number): Promise<any> {
    try {
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const now = new Date();
        const yearStart = new Date(now.getFullYear(), 0, 1);
        yearStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        // Total Bookings — all non-cancelled
        const totalBookings = await prisma.booking.count({
            where: {
                villaId,
                bookingStatus: { not: 'CANCELLED' }
            }
        });

        // Total Revenue — sum of all non-cancelled booking amounts
        const revenueResult = await prisma.booking.aggregate({
            where: {
                villaId,
                bookingStatus: { not: 'CANCELLED' }
            },
            _sum: { totalPayableAmount: true }
        });
        const totalRevenue = Number(revenueResult._sum.totalPayableAmount) || 0;

        // Occupancy Rate — YTD (Jan 1 → today)
        const availableNights = Math.max(1, Math.floor((todayEnd.getTime() - yearStart.getTime()) / MS_PER_DAY));

        const occupancyBookings = await prisma.booking.findMany({
            where: {
                villaId,
                bookingStatus: { not: 'CANCELLED' },
                checkIn: { lt: todayEnd },
                checkOut: { gt: yearStart }
            },
            select: { checkIn: true, checkOut: true }
        });

        let bookedNights = 0;
        for (const b of occupancyBookings) {
            const start = Math.max(b.checkIn.getTime(), yearStart.getTime());
            const end = Math.min(b.checkOut.getTime(), todayEnd.getTime());
            if (end > start) {
                bookedNights += Math.round((end - start) / MS_PER_DAY);
            }
        }
        const occupancyRate = Math.min(100, Math.round((bookedNights / availableNights) * 100));

        // Avg Stay — average nights per non-cancelled booking
        const stayBookings = await prisma.booking.findMany({
            where: {
                villaId,
                bookingStatus: { not: 'CANCELLED' }
            },
            select: { checkIn: true, checkOut: true }
        });

        const totalNights = stayBookings.reduce((sum, b) => {
            return sum + Math.round((b.checkOut.getTime() - b.checkIn.getTime()) / MS_PER_DAY);
        }, 0);
        const avgStay = stayBookings.length > 0 ? Math.round(totalNights / stayBookings.length) : 0;

        return { totalBookings, totalRevenue, occupancyRate, avgStay };
    }
    catch (error) {
        console.error(`Error fetching villa stats: ${error}`);
        throw new InternalServerError("Failed to fetch villa stats");
    }
}

// Service to get Villa Revenue Data
export async function getVillaRevenueService(villaId: number): Promise<any> {
    try {
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();

        // Lifetime revenue
        const lifetimeResult = await prisma.booking.aggregate({
            where: {
                villaId,
                bookingStatus: { not: 'CANCELLED' }
            },
            _sum: { totalPayableAmount: true },
            _count: { id: true }
        });
        const lifetimeRevenue = Number(lifetimeResult._sum.totalPayableAmount) || 0;
        const totalBookings = lifetimeResult._count.id || 0;
        const avgRevenuePerBooking = totalBookings > 0 ? Math.round(lifetimeRevenue / totalBookings) : 0;

        // Current month revenue
        const cmStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const cmEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const cmResult = await prisma.booking.aggregate({
            where: {
                villaId,
                bookingStatus: { not: 'CANCELLED' },
                checkIn: { gte: cmStart, lte: cmEnd }
            },
            _sum: { totalPayableAmount: true }
        });
        const currentMonthRevenue = Number(cmResult._sum.totalPayableAmount) || 0;

        // Last 12 months monthly breakdown
        const monthly = [];
        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = monthDate.getFullYear();
            const monthIndex = monthDate.getMonth();
            const monthStart = new Date(year, monthIndex, 1);
            const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

            const result = await prisma.booking.aggregate({
                where: {
                    villaId,
                    bookingStatus: { not: 'CANCELLED' },
                    checkIn: { gte: monthStart, lte: monthEnd }
                },
                _sum: { totalPayableAmount: true },
                _count: { id: true }
            });

            monthly.push({
                month: MONTH_NAMES[monthIndex],
                year,
                revenue: Number(result._sum.totalPayableAmount) || 0,
                bookingCount: result._count.id || 0
            });
        }

        return { lifetimeRevenue, currentMonthRevenue, avgRevenuePerBooking, monthly };
    }
    catch (error) {
        console.error(`Error fetching villa revenue: ${error}`);
        throw new InternalServerError("Failed to fetch villa revenue");
    }
}