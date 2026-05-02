import { google } from 'googleapis';
import { Readable } from 'stream';

export async function uploadPdfToDrive(pdfBuffer: Buffer, fileName: string) {
    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const file = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
            mimeType: 'application/pdf',
        },
        media: {
            mimeType: 'application/pdf',
            body: Readable.from(Buffer.from(pdfBuffer)),
        },
        fields: 'id, name, webViewLink',
    });

    await drive.permissions.create({
        fileId: file.data.id!,
        requestBody: { role: 'reader', type: 'anyone' },
    });

    return {
        fileId:   file.data.id!,
        fileUrl:  file.data.webViewLink!,
        fileName: file.data.name!,
    };
}
