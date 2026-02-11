# Best Practices

## General

- TypeScript strict mode enabled.
- No `any` types.
- No inline logic inside React components.
- No business logic in UI layer.
- No magic numbers outside config files.

## Resizing Quality

- Use imageSmoothingEnabled = true
- Use imageSmoothingQuality = "high"
- Downscale directly unless quality testing proves multi-step needed.

## Naming Conventions

- Functions are verbs: generateSizes, normalizeToSquare
- Services end with "Service"
- Config files end with "Config"

## Guardrails

- NEVER upscale images.
- NEVER silently skip sizes — always report skipped sizes.
- NEVER mutate original ImageBitmap.
- NEVER assume image is square.

## Scalability Guidelines

When adding features:
- Extend core modules, do not modify existing logic destructively.
- Add new processing stages as independent functions.
- Keep pipeline composable.

## Performance Constraints

- All processing must remain client-side.
- Avoid unnecessary canvas re-creation.
- Revoke object URLs after download.

## Testing Philosophy

Core logic must be testable without DOM.
Resize engine should accept Canvas and return Canvas.
