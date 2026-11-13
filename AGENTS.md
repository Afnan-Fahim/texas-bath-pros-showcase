<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the estimate's three saved photo questions in the shared QuizFlow, then use `/estimate` for its contact and Calendly stages; this preserves admin-edited options while keeping the homepage flow unchanged.
- Keep `/freeestimate` isolated with its own validated submission function and the existing leads table and email template; this avoids changing other pages or their notification recipients.
- Render `/freeestimate` from its saved availability snapshot, refresh both calendar weeks concurrently after hydration, and retain explicit mobile/desktop compressed picture sources; this keeps first paint independent of slow Calendly calls while booking validates current availability.
- Observe calendar health only on actual live availability checks; store compare-and-swap health/cooldown state on the existing availability row and send fixed owner notices synchronously through managed email, never a queue or public email endpoint, so concurrent visitors cannot duplicate alerts or slow cached first paint.
- Measure `/freeestimate` navigation-to-hydrated-frame readiness after rendering; send only slow reports with short-lived signed authorization to a dedicated fixed-recipient server function and keep compare-and-swap cooldown state separate from calendar health, so speed monitoring never blocks first paint or exposes an arbitrary email sender.
- Run bounded availability recovery only on claimed warning/slow-page alert events after first display, with no recursive warning recovery; retry only transient failures, preserve complete saved snapshots on errors, and never manufacture slots or auto-change site code, so recovery cannot slow first paint or falsely promise bookings.
- Daily loading reports use a cron-authenticated fixed-recipient route with paired UTC candidate schedules for each Central send time (4:58pm and 7:58pm) and an America/Chicago time gate; managed-email date idempotency prevents duplicates, and server HTML checks are explicitly distinguished from actual mobile rendering without adding visitor telemetry.
