import { google } from 'googleapis';
import { Readable } from 'stream';

export async function uploadPdfToDrive(pdfBuffer: Buffer, fileName: string) {
    const credentials = JSON.parse(
        Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!, 'base64').toString('utf8')
    );

    const auth = new google.auth.GoogleAuth({
        credentials,
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
