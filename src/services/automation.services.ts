import puppeteer from 'puppeteer';
import prisma from "../db/DB.ts";
import { createVoucherHTML } from "../templates/voucher.template.ts";
import { uploadPdfToDrive } from "../utils/general/googleDrive.ts";

export async function generateVoucherService({ bookingId }: { bookingId: string }) {
    try {
        // Fetch booking with all required relations
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
            include: {
                villa: {
                    include: {
                        caretakers: true,
                        managers: true,
                    }
                },
            }
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Calculate tax percentage
        const taxPercentage = Number(booking.subTotalAmount) > 0
            ? ((Number(booking.totalTax) / Number(booking.subTotalAmount)) * 100).toFixed(2)
            : '0';

        // Pick first caretaker & manager phone (fallback if not assigned)
        const caretakerPhone = booking.villa.caretakers?.[0]?.phone || 'Contact Admin';
        const managerPhone   = booking.villa.managers?.[0]?.phone   || 'Contact Admin';

        // Build template data
        const bookingData = {
            bookingId:         booking.id.toString(),
            generatedDate:     new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
            guestName:         booking.guestName,
            guestPhone:        booking.guestPhone,
            guestEmail:        booking.guestEmail || 'N/A',
            numberOfGuests:    booking.totalGuests,
            numberOfAdults:    booking.numberOfAdults,
            numberOfChildren:  booking.numberOfChildren,
            villaName:         booking.villa.name,
            villaLocation:     booking.villa.location,
            checkInDate:       booking.checkIn.toISOString().split('T')[0],
            checkOutDate:      booking.checkOut.toISOString().split('T')[0],
            numberOfNights:    booking.numberOfNights,
            bookingStatus:     booking.bookingStatus,
            bookingStatusClass: booking.bookingStatus.toLowerCase(),
            basePrice:         (booking.customPrice ?? 0).toString(),
            extraCharges:      booking.extraPersonCharge.toString(),
            discount:          booking.discount.toString(),
            taxPercentage:     taxPercentage,
            tax:               booking.totalTax.toString(),
            totalAmount:       booking.totalPayableAmount.toString(),
            amountPaid:        booking.advancePaid.toString(),
            balanceDue:        booking.dueAmount.toString(),
            caretakerPhone:    caretakerPhone,
            managerPhone:      managerPhone,
        };

        // Generate HTML from local template
        const html = createVoucherHTML(bookingData);

        // Generate PDF with Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            }
        });
        await browser.close();

        // Upload to Google Drive
        const fileName = `Booking_Voucher_${bookingData.bookingId}.pdf`;
        const driveResult = await uploadPdfToDrive(pdfBuffer, fileName);

        return {
            success:     true,
            voucherUrl:  driveResult.fileUrl,
            fileId:      driveResult.fileId,
            fileName:    driveResult.fileName,
            generatedAt: new Date().toISOString(),
        };

    } catch (error: any) {
        console.error('Error in generateVoucherService:', error);
        throw new Error(error.message || 'Failed to generate voucher');
    }
}
