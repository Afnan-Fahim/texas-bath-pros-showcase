# Center the quiz throughout the flow

## Changes
- Use one stable, viewport-sized quiz stage on the homepage and `/quiz` so question cards do not shift between steps.
- Center each new question and the Calendly screen vertically and horizontally after it renders.
- Keep the homepage header hidden while the quiz stage is active.
- Size oversized content, including Calendly, within the viewport with internal scrolling so the next action stays visible on mobile and desktop.

## Verification
- Test all three question transitions and the Calendly transition at mobile and desktop sizes.
- Confirm the card remains in the same viewport position and no header overlaps the quiz.
