/**
 * Pure utility to decode a File object into an ImageBitmap.
 * Framework-agnostic and DOM-independent (where possible).
 */
export async function loadImage(file: File): Promise<ImageBitmap> {
    try {
        const bitmap = await createImageBitmap(file);
        return bitmap;
    } catch (error) {
        console.error('Failed to load image:', error);
        throw new Error('Invalid image file or format not supported.');
    }
}
