import axios from 'axios';
import { whatsappConfig } from '../../config/whatsapp.config';

interface WhatsAppAPIResponse {
    messaging_product: string;
    contacts: Array<{
        input: string;
        wa_id: string;
    }>;
    messages: Array<{
        id: string;
    }>;
}

/**
 * Send WhatsApp template message
 * @param to - Recipient phone number (E.164 format without +)
 * @param templateName - Template name from Meta Business Suite
 * @param templateParams - Array of parameter values for template variables
 * @returns WhatsApp API response
 */
export async function sendTemplateMessage(
    to: string,
    templateName: string,
    templateParams: string[] = []
): Promise<WhatsAppAPIResponse> {
    try {
        const url = `${whatsappConfig.apiUrl}/${whatsappConfig.phoneNumberId}/messages`;

        const payload: any = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: 'en_US'
                }
            }
        };

        // Add template parameters if provided
        if (templateParams.length > 0) {
            payload.template.components = [
                {
                    type: 'body',
                    parameters: templateParams.map(param => ({
                        type: 'text',
                        text: param
                    }))
                }
            ];
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${whatsappConfig.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('WhatsApp API Error:', error.response?.data || error.message);
        throw new Error(
            error.response?.data?.error?.message ||
            'Failed to send WhatsApp message'
        );
    }
}

/**
 * Upload media to WhatsApp (for sending PDFs, images, etc.)
 * @param mediaUrl - Public URL of the media file
 * @returns Media ID from WhatsApp
 */
export async function uploadMedia(mediaUrl: string): Promise<string> {
    try {
        const url = `${whatsappConfig.apiUrl}/${whatsappConfig.phoneNumberId}/media`;

        const response = await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                file: mediaUrl,
                type: 'application/pdf'
            },
            {
                headers: {
                    'Authorization': `Bearer ${whatsappConfig.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.id;
    } catch (error: any) {
        console.error('WhatsApp Media Upload Error:', error.response?.data || error.message);
        throw new Error('Failed to upload media to WhatsApp');
    }
}

/**
 * Send document message with optional caption
 * @param to - Recipient phone number (E.164 format without +)
 * @param documentUrl - Public URL of the document
 * @param caption - Optional caption for the document
 * @param filename - Optional filename
 * @returns WhatsApp API response
 */
export async function sendDocumentMessage(
    to: string,
    documentUrl: string,
    caption?: string,
    filename?: string
): Promise<WhatsAppAPIResponse> {
    try {
        const url = `${whatsappConfig.apiUrl}/${whatsappConfig.phoneNumberId}/messages`;

        const payload: any = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'document',
            document: {
                link: documentUrl
            }
        };

        // Add caption if provided
        if (caption) {
            payload.document.caption = caption;
        }

        // Add filename if provided
        if (filename) {
            payload.document.filename = filename;
        }

        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${whatsappConfig.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('WhatsApp Document Send Error:', error.response?.data || error.message);
        throw new Error(
            error.response?.data?.error?.message ||
            'Failed to send document via WhatsApp'
        );
    }
}