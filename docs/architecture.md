# Architecture

## Architectural Principles

1. Separation of concerns
2. Deterministic transformations
3. Pure processing pipeline
4. Stateless core logic
5. UI as orchestration layer only

## High-Level Structure

/src
  /core
    imageLoader.ts
    squareNormalizer.ts
    resizeEngine.ts
    sizeConfig.ts
  /services
    zipService.ts
    downloadService.ts
  /ui
    UploadPanel.tsx
    PreviewPanel.tsx
    ResultGrid.tsx
  App.tsx

## Processing Pipeline

File → Decode → Normalize to Square → Resize → Export PNG → Package → Download

Each stage must be isolated and testable.

## Core Modules

### imageLoader.ts
- Accepts File
- Returns ImageBitmap
- Extracts width/height metadata

### squareNormalizer.ts
- Accepts ImageBitmap
- Returns square Canvas
- Pads transparent background
- No cropping

### resizeEngine.ts
- Accepts square source canvas
- Accepts target sizes array
- Returns Map<size, Canvas>
- Enforces no-upscale rule

### sizeConfig.ts
- Exports constant array of sizes
- Must not contain logic

### zipService.ts
- Accepts generated PNG blobs
- Returns ZIP blob
- Pure utility

### downloadService.ts
- Accepts blob + filename
- Triggers browser download

## Rules

- Core logic must NOT import React.
- UI must NOT perform pixel manipulation.
- No side effects inside resizeEngine.
- All resizing must be deterministic.
