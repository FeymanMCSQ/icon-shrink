/**
 * Normalizes an ImageBitmap to a square OffscreenCanvas by adding transparent padding.
 * @param source The source ImageBitmap to normalize.
 * @returns A promise that resolves to a square OffscreenCanvas.
 */
export async function toSquareCanvas(source: ImageBitmap): Promise<OffscreenCanvas> {
    const { width, height } = source;
    const max = Math.max(width, height);

    // Create a square OffscreenCanvas
    const canvas = new OffscreenCanvas(max, max);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get 2D context for OffscreenCanvas');
    }

    // Calculate centering coordinates
    const x = (max - width) / 2;
    const y = (max - height) / 2;

    // Draw the source image centered on the square canvas
    // By default, the canvas is transparent, so padding will be transparent.
    ctx.drawImage(source, x, y);

    return canvas;
}
