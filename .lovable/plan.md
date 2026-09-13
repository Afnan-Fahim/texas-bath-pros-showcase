# Balance Homepage Photos

## Changes
- Update only the homepage booking quiz presentation, leaving `/quiz`, `/admin`, all wording, and uploaded image data unchanged.
- Give homepage quiz photos a consistent visual frame that scales each image without stretching, uses the available card area well, and avoids harsh empty bands.
- Refine only the homepage inspiration carousel sizing so portrait and landscape uploads each use an appropriate frame, remain fully visible, and keep the arrows outside.
- Preserve the existing gallery order, dots, swipe behavior, quiz flow, and desktop/mobile layouts.

## Technical details
- Add a homepage-only image treatment to the shared quiz card rather than altering the compact `/quiz` variant.
- Keep intrinsic aspect ratios and use responsive bounds for the carousel, with image-aware frame dimensions on both desktop and mobile.

## Verification
- Check homepage quiz photos and every carousel photo at desktop and phone sizes.
- Confirm there is no stretching, excessive empty framing, or accidental clipping, and that `/quiz` and `/admin` are unchanged.
