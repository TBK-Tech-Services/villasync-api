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

    // Calculate nights
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Format dates
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Create email subject
    const subject = `🏖️ Your Booking Confirmation - ${booking.villa.name}`;

    // Create HTML email template with enhanced design
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - TBK Villas</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 100%); -webkit-font-smoothing: antialiased;">
          
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 100%); padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <!-- Content Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(255, 107, 53, 0.15); overflow: hidden;">
                  
                  <!-- Header with Logo and Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); padding: 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <!-- Logo Section -->
                        <tr>
                          <td align="center" style="padding: 40px 30px 20px;">
                            <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 16px; padding: 16px; display: inline-block; border: 2px solid rgba(255, 255, 255, 0.3);">
                              <!-- TBK Logo SVG -->
                              <svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="100" cy="100" r="95" fill="rgba(255, 255, 255, 0.95)"/>
                                <path d="M100 40 L140 80 L100 120 L60 80 Z" fill="#FF6B35"/>
                                <circle cx="100" cy="140" r="20" fill="#FF8F5C"/>
                                <rect x="90" y="120" width="20" height="40" rx="4" fill="#FF6B35"/>
                              </svg>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Title -->
                        <tr>
                          <td align="center" style="padding: 0 30px 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 700; color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.1); letter-spacing: -0.5px;">TBK Villas</h1>
                            <p style="margin: 10px 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.95); font-weight: 500;">Your Gateway to Coastal Paradise</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Success Badge -->
                  <tr>
                    <td align="center" style="padding: 0; transform: translateY(-25px);">
                      <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 12px 30px; border-radius: 50px; display: inline-block; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); border: 3px solid white;">
                        ✓ Booking Confirmed
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      
                      <!-- Greeting -->
                      <h2 style="margin: 0 0 15px; font-size: 26px; color: #1F2937; font-weight: 600;">Dear ${booking.guestName},</h2>
                      <p style="margin: 0 0 25px; font-size: 16px; color: #6B7280; line-height: 1.6;">${validatedData.message}</p>
                      
                      <!-- Villa Card -->
                      <div style="background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 100%); border-radius: 16px; padding: 25px; margin: 30px 0; border: 2px solid #FFE4D6;">
                        <h3 style="margin: 0 0 20px; font-size: 20px; color: #FF6B35; font-weight: 600; display: flex; align-items: center;">
                          🏡 ${booking.villa.name}
                        </h3>
                        
                        <!-- Booking Details Grid -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                          <tr>
                            <td width="50%" style="padding: 12px 12px 12px 0; vertical-align: top;">
                              <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid #10B981;">
                                <p style="margin: 0; font-size: 12px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Check-in</p>
                                <p style="margin: 5px 0 0; font-size: 15px; color: #1F2937; font-weight: 600;">📅 ${formatDate(checkIn)}</p>
                              </div>
                            </td>
                            <td width="50%" style="padding: 12px 0 12px 12px; vertical-align: top;">
                              <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid #EF4444;">
                                <p style="margin: 0; font-size: 12px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Check-out</p>
                                <p style="margin: 5px 0 0; font-size: 15px; color: #1F2937; font-weight: 600;">📅 ${formatDate(checkOut)}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Additional Details -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 10px 0; border-top: 1px solid rgba(255, 107, 53, 0.2);">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td width="50%">
                                    <p style="margin: 0; font-size: 13px; color: #6B7280;">🌙 Duration</p>
                                    <p style="margin: 5px 0 0; font-size: 16px; color: #1F2937; font-weight: 600;">${nights} ${nights === 1 ? 'Night' : 'Nights'}</p>
                                  </td>
                                  <td width="50%">
                                    <p style="margin: 0; font-size: 13px; color: #6B7280;">👥 Guests</p>
                                    <p style="margin: 5px 0 0; font-size: 16px; color: #1F2937; font-weight: 600;">${booking.totalGuests} ${booking.totalGuests === 1 ? 'Guest' : 'Guests'}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          
                          <tr>
                            <td style="padding: 15px 0 0;">
                              <div style="background: white; padding: 15px; border-radius: 10px; border: 2px solid #FF6B35;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td>
                                      <p style="margin: 0; font-size: 13px; color: #6B7280;">Booking ID</p>
                                      <p style="margin: 5px 0 0; font-size: 15px; color: #1F2937; font-weight: 600;">#${booking.id}</p>
                                    </td>
                                    <td align="right">
                                      <p style="margin: 0; font-size: 13px; color: #6B7280;">Total Amount</p>
                                      <p style="margin: 5px 0 0; font-size: 22px; color: #FF6B35; font-weight: 700;">₹${booking.totalPayableAmount.toLocaleString()}</p>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Attachment Info -->
                      <div style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #6366F1;">
                        <p style="margin: 0; font-size: 14px; color: #4338CA; font-weight: 600;">📎 Download Your Voucher</p>
                        <p style="margin: 8px 0 0; font-size: 14px; color: #6B7280; line-height: 1.5;">Your detailed booking voucher is ready. Click the download button below to save it for check-in.</p>
                      </div>
                      
                      <!-- Important Note -->
                      <div style="background: #FEF3C7; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #F59E0B;">
                        <p style="margin: 0; font-size: 14px; color: #92400E; font-weight: 600;">⚠️ Important Reminders</p>
                        <ul style="margin: 10px 0 0; padding-left: 20px; font-size: 14px; color: #78350F; line-height: 1.6;">
                          <li>Check-in time: 2:00 PM | Check-out time: 11:00 AM</li>
                          <li>Please carry a valid ID proof for verification</li>
                          <li>Contact us 24 hours prior for any special requests</li>
                        </ul>
                      </div>
                      
                      <!-- CTA Buttons -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <!-- Download Button -->
                                <td style="padding: 0 10px;">
                                  <a href="${validatedData.voucherUrl}" 
                                     target="_blank"
                                     style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                                            color: white; 
                                            text-decoration: none; 
                                            padding: 16px 30px; 
                                            border-radius: 50px; 
                                            font-weight: 600; 
                                            font-size: 16px; 
                                            display: inline-block; 
                                            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); 
                                            white-space: nowrap;">
                                    📄 Download Voucher
                                  </a>
                                </td>
                                <!-- Contact Button -->
                                <td style="padding: 0 10px;">
                                  <a href="mailto:${process.env.GMAIL_USER}" 
                                     style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); 
                                            color: white; 
                                            text-decoration: none; 
                                            padding: 16px 30px; 
                                            border-radius: 50px; 
                                            font-weight: 600; 
                                            font-size: 16px; 
                                            display: inline-block; 
                                            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3); 
                                            white-space: nowrap;">
                                    📧 Contact Us
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Closing Message -->
                      <p style="margin: 30px 0 0; font-size: 16px; color: #1F2937; line-height: 1.6; text-align: center;">
                        We're excited to welcome you to <strong style="color: #FF6B35;">TBK Villas</strong>!<br/>
                        <span style="color: #6B7280; font-size: 14px;">Get ready for an unforgettable coastal getaway. 🌴</span>
                      </p>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1F2937 0%, #111827 100%); padding: 30px 40px; border-radius: 0 0 20px 20px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <!-- Contact Info -->
                        <tr>
                          <td align="center" style="padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <p style="margin: 0 0 12px; font-size: 16px; color: #ffffff; font-weight: 600;">Get in Touch</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 8px 15px;">
                                  <a href="mailto:${process.env.GMAIL_USER}" style="color: #FF8F5C; text-decoration: none; font-size: 14px; font-weight: 500;">
                                    📧 ${process.env.GMAIL_USER}
                                  </a>
                                </td>
                                <td style="padding: 8px 15px; border-left: 1px solid rgba(255, 255, 255, 0.2);">
                                  <a href="tel:+919876543210" style="color: #FF8F5C; text-decoration: none; font-size: 14px; font-weight: 500;">
                                    📞 +91 98765 43210
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Social Links (Optional) -->
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <p style="margin: 0 0 12px; font-size: 13px; color: rgba(255, 255, 255, 0.7);">Follow Us</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 8px;">
                                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: white; font-size: 16px;">📘</a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: white; font-size: 16px;">📸</a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="#" style="display: inline-block; width: 36px; height: 36px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: white; font-size: 16px;">🐦</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Copyright -->
                        <tr>
                          <td align="center" style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.6); line-height: 1.6;">
                              © ${new Date().getFullYear()} TBK Villas. All rights reserved.<br/>
                              <span style="color: rgba(255, 255, 255, 0.4);">Making your coastal dreams come true, one villa at a time.</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                </table>
                
                <!-- Disclaimer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin-top: 20px;">
                  <tr>
                    <td align="center">
                      <p style="margin: 0; font-size: 11px; color: rgba(0, 0, 0, 0.5); line-height: 1.5;">
                        This email was sent to ${validatedData.email}. Please do not reply to this email.<br/>
                        If you have any questions, contact us at ${process.env.GMAIL_USER}
                      </p>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
          
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