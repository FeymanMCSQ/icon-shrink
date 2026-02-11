/**
 * High-quality resizing logic using OffscreenCanvas.
 */
export async function resizeTo(source: OffscreenCanvas, size: number): Promise<Blob> {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get 2D context for resizing');
    }

    // Enable high-quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the source canvas into the target square canvas
    ctx.drawImage(source, 0, 0, size, size);

    const blob = await canvas.convertToBlob({ type: 'image/png' });
    if (!blob) {
        throw new Error('Failed to convert canvas to blob');
    }

    return blob;
}
