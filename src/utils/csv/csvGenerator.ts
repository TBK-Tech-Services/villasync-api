
export function generateCSV(data: Record<string, any>[]): string {
    if (data.length === 0) {
        return '';
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create header row
    const headerRow = headers.join(',');

    // Create data rows
    const dataRows = data.map(row =>
        headers.map(header => row[header]).join(',')
    );

    // Combine header and data rows
    return [headerRow, ...dataRows].join('\n');
}