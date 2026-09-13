# Homepage quiz card photo layout

## Goal
Make each homepage quiz choice a matching card with a square, edge-to-edge photo and a compact label below.

## Changes
- Change only the non-compact homepage card photo area from 4:5 to 1:1.
- Keep the image at full width and height with `object-fit: cover` and no wrapper padding.
- Preserve equal card sizing, the label below each photo, and the “I’m unsure” option beneath the pair.
- Leave `/quiz`, `/admin`, image files, and question wording unchanged.

## Verification
- Check homepage cards at desktop and mobile sizes.
- Confirm `/quiz` still uses its existing compact card treatment.
