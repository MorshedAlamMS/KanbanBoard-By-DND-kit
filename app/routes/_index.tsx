import type { MetaFunction } from "@remix-run/node";
import KanbanBoard from "~/components/KanbanBoard";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Project Boards</h1>
      <KanbanBoard />
    </main>
  );
}


