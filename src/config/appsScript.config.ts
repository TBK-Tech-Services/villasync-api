
export const appsScriptConfig = {
    voucherUrl: process.env.APPS_SCRIPT_VOUCHER_URL || '',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    }
};