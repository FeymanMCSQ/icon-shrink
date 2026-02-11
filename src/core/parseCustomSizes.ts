/**
 * Parses a comma-separated string of numbers into an array of unique integers.
 */
export function parseCustomSizesInput(input: string): { sizes: number[], errors: string[] } {
    const parts = input.split(',').map(p => p.trim()).filter(p => p !== '');
    const sizes: number[] = [];
    const errors: string[] = [];

    parts.forEach(part => {
        const val = parseInt(part, 10);
        if (isNaN(val) || val.toString() !== part) {
            errors.push(`"${part}" is not a valid number.`);
        } else {
            sizes.push(val);
        }
    });

    return {
        sizes: Array.from(new Set(sizes)), // Unique values
        errors
    };
}
