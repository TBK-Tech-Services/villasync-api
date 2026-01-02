
export const appsScriptConfig = {
    voucherUrl: process.env.APPS_SCRIPT_VOUCHER_URL || '',
    availabilityUrl: process.env.AVAILABILITY_SCRIPT_URL || '',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
};