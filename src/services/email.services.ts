import prisma from "../db/DB";
import { sendEmailWithPDF } from "../utils/automation/gmail";
import type { sendVoucherEmailData } from "../validators/data-validators/automation/email";

export async function sendVoucherEmailService(
    bookingId: string,
    validatedData: sendVoucherEmailData
) {
    try {
        // Fetch booking details
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(bookingId) },
            include: {
                villa: true,
            }
        });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // Create email subject
        const subject = `Booking Voucher - ${booking.villa.name}`;

        // Create HTML email template
        const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B35; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TBK Villas</h1>
              <p>Your Booking Voucher</p>
            </div>
            <div class="content">
              <h2>Dear ${booking.guestName},</h2>
              <p>${validatedData.message}</p>
              
              <div class="message">
                <h3>Booking Details:</h3>
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Villa:</strong> ${booking.villa.name}</p>
                <p><strong>Check-in:</strong> ${booking.checkIn.toISOString().split('T')[0]}</p>
                <p><strong>Check-out:</strong> ${booking.checkOut.toISOString().split('T')[0]}</p>
                <p><strong>Guests:</strong> ${booking.totalGuests}</p>
                <p><strong>Total Amount:</strong> ₹${booking.totalPayableAmount}</p>
              </div>
              
              <p>Please find your booking voucher attached to this email.</p>
              <p>We look forward to welcoming you!</p>
            </div>
            <div class="footer">
              <p>© 2025 TBK Villas. All rights reserved.</p>
              <p>Contact: ${process.env.GMAIL_USER} | Phone: +91 98765 43210</p>
            </div>
          </div>
        </body>
      </html>
    `;

        // Send email with PDF
        const result = await sendEmailWithPDF(
            validatedData.email,
            subject,
            htmlContent,
            validatedData.voucherUrl,
            `Booking_Voucher_${booking.id}.pdf`
        );

        return {
            success: true,
            messageId: result.messageId,
            sentTo: validatedData.email,
        };
    } catch (error: any) {
        console.error('Error in sendVoucherEmailService:', error);
        throw new Error(error.message || 'Failed to send voucher email');
    }
}