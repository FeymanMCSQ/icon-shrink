/**
 * Validates a single custom icon size against project rules.
 */
export function validateCustomSize(size: number, maxSize: number): { ok: true } | { ok: false, reason: string } {
    if (!Number.isInteger(size)) {
        return { ok: false, reason: 'Size must be an integer.' };
    }

    if (size < 1) {
        return { ok: false, reason: 'Size must be at least 1px.' };
    }

    if (size > maxSize) {
        return { ok: false, reason: `Size cannot exceed source (${maxSize}px).` };
    }

    return { ok: true };
}
