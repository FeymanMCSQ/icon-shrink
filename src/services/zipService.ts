import JSZip from 'jszip';

interface IconData {
    size: number;
    blob: Blob;
}

/**
 * Generates a ZIP file containing all icons in an 'icons/' folder.
 */
export async function generateZip(icons: IconData[]): Promise<Blob> {
    const zip = new JSZip();
    const folder = zip.folder('icons');

    if (!folder) {
        throw new Error('Failed to create folder in ZIP');
    }

    // Add each icon to the folder
    icons.forEach((icon) => {
        folder.file(`icon-${icon.size}.png`, icon.blob);
    });

    // Generate the ZIP blob
    return await zip.generateAsync({ type: 'blob' });
}
