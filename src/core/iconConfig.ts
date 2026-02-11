/**
 * Predefined production icon sizes.
 */
export const TARGET_SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512];

/**
 * Merges default sizes with custom ones, ensuring a unique, sorted list.
 */
export function mergeSizes(defaults: number[], custom: number[]): number[] {
    return Array.from(new Set([...defaults, ...custom])).sort((a, b) => a - b)
}
;
