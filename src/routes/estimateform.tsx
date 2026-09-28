import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address — permanently sends visitors (and ad query params like fbclid) to /estimate.
export const Route = createFileRoute("/estimateform")({
  beforeLoad: ({ location }) => {
    throw redirect({ to: "/estimate", search: location.search as never, statusCode: 301 });
  },
});
