# Task roadmap

## Current
- Warranty page: add a clean white box near the top with "We have one of the strongest warranties in the industry.", keep the 5-star/no-complaints line, refine spacing, keep plumbing lower, then publish.
- Activate daily website speed/loading reports for Josiah at 4:58 p.m. and 7:58 p.m. America/Chicago; both managed schedules verified active, separate per-time delivery identities fixed, blocked on publishing approval. Reports check homepage, /estimate and /freeestimate server HTML loading and saved calendar/slow-alert state, not full mobile rendering.
- Replace Calendly’s connected old Gmail calendar with Contact@TexasBathSolutions.com so confirmation and cancellation invitations use the correct sender; blocked on the account owner reconnecting the calendar in Calendly’s Calendar Sync settings. Screenshot confirms these invitations are sent by the old Gmail calendar, not Lovable Emails; website email changes cannot change their sender.

## Completed
- Warranty page design polish: soft navy accent bar and 5-star/no-complaints line under the heading, side-by-side covered/not-covered cards on desktop (stacked on mobile), polished grab-bars and plumbing boxes, all warranty wording verified unchanged; published and checked live on phone and computer.
- Warranty page at /warranty: headline "Hey San Antonio & Surrounding Areas, You're Protected… FOR LIFE!", BCI lifetime details, covered/not-covered, grab bars and faucets, then Plumbing Warranty (1-year) near the bottom; published and verified live on phone and computer.
- Automate bounded retry and real saved-time refresh after claimed calendar-warning and slow-page alerts; errors preserve the complete snapshot and recovery notices do not recurse. Tests passed; preview phone form/calendar readiness 1.02 seconds, computer 0.49 seconds with no page errors. Preview only; publishing required. Cannot repair visitor connectivity, Calendly account access, or rewrite/deploy site code automatically.
- Add Josiah-only slow-page emails for `/freeestimate` navigation-to-interactive-frame times strictly over 2.5 seconds, signed reports and four-hour deduplication; recipient corrected from Justin to Josiah on request. Preview only; publishing required for live activation. Reports cannot detect visitors who leave before the page becomes interactive or when JavaScript fails entirely.
- Add `/freeestimate` calendar failure/empty-times and recovery owner emails, four-hour warning cooldown, concurrency-safe persisted health state, and tests; verified real error sent both owner emails and preview phone first display in 1.0–1.2 seconds. Await explicit publishing request for production activation.
- Further compressed `/freeestimate` photos and logo, preserved uncached SSR calendar preloading, and verified phone readiness and available-day selection; public-photo finding awaits its required ignore approval card.
- Improve only `/freeestimate` loading: parallel calendar preloading, responsive compressed existing images and logo; published and verified live on desktop and simulated Facebook phone browser with immediate calendar, PageView transmission, preserved attribution, and no observed page errors; form, wording and layout unchanged.
- Restyle the `/freeestimate` form card: softer deeper drop shadow, slightly thicker light-navy border, more inner padding, light gray dividers between question sections, bolder question titles, and radio buttons with a thin navy outline; verify desktop and phone, keep wording, fields, button and pixel unchanged, and publish.
- Polish `/freeestimate`: soft warm off-white page wash, deeper form-card padding and shadow, matching rounded shadowed photo, trust line restyled as gold-star pills, tighter photo/paragraph/badge spacing on desktop and mobile; verify both layouts and publish.
- Add the gold five-star trust line to `/freeestimate` under the photo and paragraph on desktop and under the paragraph on mobile, verify both layouts, and request publishing.
- Replace the `/freeestimate` photo with the newly uploaded holiday image; verify the full image remains visible on desktop and mobile and request publishing.
- Replace the `/freeestimate` photo paragraph with the new financing and guarantee wording at 19px Inter in dark navy with comfortable line spacing, aligned under the photo on desktop, and publish.
- Move the `/freeestimate` intro below the large desktop photo and above the full-width mobile form beneath a compact uncropped banner; verify both layouts and request publishing.
- Swap the `/freeestimate` photo for the uploaded walk-in shower image, shown uncropped and undistorted on the right on desktop and as a full-width banner under the header on mobile, add the financing/guarantee paragraph above the first question, and publish.
- Add and verify the isolated `/freeestimate` single-page form with required answers, saved choices, immediate storage and two owner emails, and booking-only conversions (Calendly confirmation signal simulated; no appointment created).
- Turn the homepage inspiration gallery into a three-card desktop showroom and single-card mobile carousel with thumbnails, existing photos, and an estimate button.
- Restore all three saved admin photo questions on `/estimate`, followed by the existing lead form and Calendly.
- Keep five-step counters and Back navigation; verify answer capture and booking tracking.
- Publish the updated estimate flow to the live site.
- [x] /freeestimate: show open times on page before clicking button; publish

- [x] /freeestimate: fix false "That time was just taken" error so open times book; publish and test
