# Icon Shrinker — Project Overview

## Mission

Icon Shrinker is a client-side web tool that generates production-ready icon sizes from a single source image.

The tool:
- Only downsizes images (never upscales).
- Ensures square outputs (pad-to-square by default).
- Generates predefined production icon sizes.
- Outputs downloadable PNGs and a ZIP bundle.

## Core Philosophy

- Deterministic.
- Client-side only.
- No persistence.
- No accounts.
- No telemetry.
- No feature bloat.

This is a pixel-processing utility, not a design app.

## Initial Supported Sizes

16
32
48
64
128
180 (Apple Touch)
192
256
512

## Non-Goals (Phase 1)

- Image editing
- Filters
- Cropping UI
- Aspect ratio customization
- Backend processing
- Database
- Auth

## Why This Exists

Manual resizing is repetitive, error-prone, and time-wasting.
This tool eliminates mechanical resizing work while enforcing best practices.

## Future Extensibility

The system must be structured so we can later add:
- SVG optimization
- Favicon.ico bundling
- Manifest.json generator
- Android adaptive icons
- Batch processing
- CLI export
