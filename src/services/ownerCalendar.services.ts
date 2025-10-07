import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to Get Owner Calendar Availability
export async function getOwnerCalendarAvailabilityService() {
    try {
        // TODO: Implement database query logic
        return {};
    } 
    catch (error) {
        console.error(`Error while getting calendar availability: ${error}`);
        throw new InternalServerError("Failed to retrieve calendar availability");
    }
}