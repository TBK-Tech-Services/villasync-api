import { parsePhoneNumber, isValidPhoneNumber as validatePhone } from 'libphonenumber-js';

/**
 * Validate phone number format
 * @param phoneNumber - Phone number to validate
 * @returns boolean - true if valid
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
    try {
        return validatePhone(phoneNumber);
    } catch (error) {
        return false;
    }
}

/**
 * Format phone number to E.164 format (required by WhatsApp)
 * Example: +919876543210
 * @param phoneNumber - Phone number to format
 * @param countryCode - Country code (default: 'IN')
 * @returns Formatted phone number or null if invalid
 */
export function formatPhoneNumberE164(phoneNumber: string, countryCode: string = 'IN'): string | null {
    try {
        // Remove all spaces, dashes, parentheses
        const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

        // Parse phone number
        const parsed = parsePhoneNumber(cleaned, countryCode as any);

        if (!parsed || !parsed.isValid()) {
            return null;
        }

        // Return E.164 format (e.g., +919876543210)
        return parsed.format('E.164');
    } catch (error) {
        return null;
    }
}

/**
 * Parse phone number and extract details
 * @param phoneNumber - Phone number to parse
 * @returns Parsed phone details or null if invalid
 */
export function parsePhone(phoneNumber: string) {
    try {
        const parsed = parsePhoneNumber(phoneNumber);

        if (!parsed || !parsed.isValid()) {
            return null;
        }

        return {
            country: parsed.country,
            countryCallingCode: parsed.countryCallingCode,
            nationalNumber: parsed.nationalNumber,
            e164: parsed.format('E.164'),
            international: parsed.formatInternational(),
            national: parsed.formatNational()
        };
    } catch (error) {
        return null;
    }
}

/**
 * Extract WhatsApp-compatible phone number (without + sign)
 * Example: 919876543210
 * @param phoneNumber - Phone number in E.164 format
 * @returns Phone number without + sign
 */
export function getWhatsAppNumber(phoneNumber: string): string {
    // Remove + sign if present
    return phoneNumber.replace(/^\+/, '');
}