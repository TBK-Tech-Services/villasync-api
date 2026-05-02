import fs from 'fs';
import path from 'path';

export async function uploadPdfToDrive(pdfBuffer: Buffer, fileName: string) {
    const vouchersDir = path.join(process.cwd(), 'public', 'vouchers');
    fs.mkdirSync(vouchersDir, { recursive: true });

    const filePath = path.join(vouchersDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const fileUrl = `${process.env.API_BASE_URL}/vouchers/${fileName}`;

    return {
        fileId:   fileName,
        fileUrl,
        fileName,
    };
}
