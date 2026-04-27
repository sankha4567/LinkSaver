"use client";

import Navbar from "@/components/Navbar";
import LinkList from "@/components/LinkList";
import AuthGate from "@/components/AuthGate";
import { useSearchStore } from "@/store/search-store";

export default function Home() {
  const searchTerm = useSearchStore((state) => state.searchTerm);

  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Your Links</h1>
          <LinkList searchTerm={searchTerm} />
        </main>
      </div>
    </AuthGate>
  );
}
