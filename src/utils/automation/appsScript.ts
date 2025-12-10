import axios from 'axios';
import { appsScriptConfig } from '../../config/appsScript.config';

export async function callAppsScript(bookingData: any) {
    try {
        const response = await axios.post(
            appsScriptConfig.voucherUrl,
            bookingData,
            {
                headers: appsScriptConfig.headers,
                timeout: appsScriptConfig.timeout,
            }
        );

        const result = response.data;

        if (!result.success) {
            throw new Error(result.error || 'Apps Script failed to generate voucher');
        }

        return {
            fileId: result.fileId,
            fileUrl: result.fileUrl,
            fileName: result.fileName,
            generatedAt: result.generatedAt,
        };
    }
    catch (error: any) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Apps Script request timeout - Please try again');
        }

        if (error.response) {
            throw new Error(`Apps Script error: ${error.response.data?.error || error.message}`);
        }

        throw new Error(`Failed to call Apps Script: ${error.message}`);
    }
};