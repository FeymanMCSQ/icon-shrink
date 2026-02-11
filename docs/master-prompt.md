# Master Prompt — Icon Shrinker

You are implementing a production-grade but minimal client-side image resizing tool.

Read all documentation in /docs before writing code.

## Constraints

- This is a deterministic pixel-processing utility.
- Architecture must strictly follow /docs/architecture.md.
- Core logic must be framework-agnostic.
- No feature creep.
- No backend.
- No upscaling ever.

## Implementation Rules

1. Build core modules first.
2. Ensure resizeEngine enforces downscale-only rule.
3. UI must orchestrate only.
4. Use strict TypeScript.
5. Do not mix concerns.
6. Use padding to square, not cropping.
7. Use high-quality image smoothing.

## Order of Work

1. Implement core/imageLoader.ts
2. Implement core/squareNormalizer.ts
3. Implement core/resizeEngine.ts
4. Implement services
5. Build minimal UI
6. Integrate

## Deliverables

- Working upload
- Proper preview
- Valid size outputs
- Correct skipped sizes
- Individual downloads
- ZIP download

## Absolutely Forbidden

- Adding unnecessary dependencies
- Styling frameworks
- Global state libraries
- Backend APIs
- Analytics
- Complex state machines

Keep the tool simple, deterministic, and scalable.
