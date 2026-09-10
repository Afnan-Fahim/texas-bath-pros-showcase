import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/AdminPanel";
import logoImg from "@/assets/logo-header.webp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Texas Bath Solutions" },
      { name: "description", content: "Texas Bath Solutions lead and quiz photo administration." },
      { property: "og:title", content: "Admin | Texas Bath Solutions" },
      { property: "og:description", content: "Texas Bath Solutions lead and quiz photo administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="w-full bg-background border-b border-border py-4 px-6 flex justify-center shadow-sm">
        <a href="/">
          <img src={logoImg} alt="Texas Bath Solutions" className="h-10 object-contain" />
        </a>
      </header>
      <main className="flex-1 w-full p-4">
        <AdminPanel />
      </main>
    </div>
  );
}
