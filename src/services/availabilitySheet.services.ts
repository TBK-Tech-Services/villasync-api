import prisma from "../db/DB.ts";
import { appsScriptConfig } from "../config/appsScript.config.ts";

// Get all active villas (for sheet headers)
async function getAllVillas() {
    const villas = await prisma.villa.findMany({
        orderBy: [{ bedrooms: "asc" }, { name: "asc" }],
        select: { id: true, name: true, bedrooms: true }
    });
    return villas;
};

// Sync availability on booking create
export async function syncAvailabilityOnCreate(villaName: string, checkIn: Date, checkOut: Date): Promise<void> {
    try {
        const villas = await getAllVillas();

        const response = await fetch(appsScriptConfig.availabilityUrl, {
            method: "POST",
            headers: appsScriptConfig.headers,
            body: JSON.stringify({
                action: "BOOK",
                villaName,
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString(),
                villas
            })
        });

        const result = await response.json();

        if (!result.success) {
            console.error("Availability sync failed:", result.error);
        } else {
            console.log("Availability sync success:", result);
        }
    } catch (error) {
        console.error("Availability sync error:", error);
    }
}

// Sync availability on booking delete
export async function syncAvailabilityOnDelete(villaName: string, checkIn: Date, checkOut: Date): Promise<void> {
    try {
        const villas = await getAllVillas();

        const response = await fetch(appsScriptConfig.availabilityUrl, {
            method: "POST",
            headers: appsScriptConfig.headers,
            body: JSON.stringify({
                action: "UNBOOK",
                villaName,
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString(),
                villas
            })
        });

        const result = await response.json();

        if (!result.success) {
            console.error("Availability sync failed:", result.error);
        } else {
            console.log("Availability sync success:", result);
        }
    } catch (error) {
        console.error("Availability sync error:", error);
    }
}

// Sync availability on booking update (dates changed)
export async function syncAvailabilityOnUpdate(
    villaName: string,
    oldCheckIn: Date,
    oldCheckOut: Date,
    newCheckIn: Date,
    newCheckOut: Date
): Promise<void> {
    try {
        const villas = await getAllVillas();

        const response = await fetch(appsScriptConfig.availabilityUrl, {
            method: "POST",
            headers: appsScriptConfig.headers,
            body: JSON.stringify({
                action: "UPDATE",
                villaName,
                oldCheckIn: oldCheckIn.toISOString(),
                oldCheckOut: oldCheckOut.toISOString(),
                newCheckIn: newCheckIn.toISOString(),
                newCheckOut: newCheckOut.toISOString(),
                villas
            })
        });

        const result = await response.json();

        if (!result.success) {
            console.error("Availability sync failed:", result.error);
        } else {
            console.log("Availability sync success:", result);
        }
    } catch (error) {
        console.error("Availability sync error:", error);
    }
}