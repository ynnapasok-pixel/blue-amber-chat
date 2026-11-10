import { createFileRoute } from "@tanstack/react-router";

import { BlueyChat } from "@/components/chat/bluey-chat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bluey — Your Chat Assistant" },
      {
        name: "description",
        content: "Bluey is a clean, professional chat assistant ready to help with everyday tasks.",
      },
      { property: "og:title", content: "Bluey — Your Chat Assistant" },
      {
        property: "og:description",
        content: "Bluey is a clean, professional chat assistant ready to help with everyday tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex h-dvh items-center justify-center p-3 sm:p-6">
      <div className="h-full w-full max-w-4xl sm:max-h-[860px]">
        <BlueyChat />
      </div>
    </main>
  );
}
