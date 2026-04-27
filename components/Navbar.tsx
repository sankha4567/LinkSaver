import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Plus, Link2 } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-md shadow-sm">
              <Link2 className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              LinkSaver
            </span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button asChild>
              <Link href="/create">
                <Plus />
                <span className="hidden sm:inline">Create</span>
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
