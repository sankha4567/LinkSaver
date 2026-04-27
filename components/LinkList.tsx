"use client";

import { useQuery } from "convex/react";
import { Link2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import LinkListCard from "./LinkListCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LinkList = ({ searchTerm }: { searchTerm: string }) => {
  const links = useQuery(api.links.searchLinks, { searchTerm });

  if (links === undefined) {
    return (
      <div
        role="status"
        aria-label="Loading your links"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="size-9 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-3 w-24 mt-4" />
          </Card>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-6 text-center border-dashed">
        <div className="bg-muted text-muted-foreground p-4 rounded-full mb-4">
          {searchTerm ? (
            <AlertTriangle className="size-8" />
          ) : (
            <Link2 className="size-8" />
          )}
        </div>
        {searchTerm ? (
          <>
            <h3 className="text-lg font-semibold mb-1">No links found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No links match &ldquo;{searchTerm}&rdquo;. Try a different search.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-1">No links saved yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Start by saving your first link.
            </p>
            <Button asChild>
              <Link href="/create">Create your first link</Link>
            </Button>
          </>
        )}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link) => (
        <LinkListCard key={link._id} Link={link} />
      ))}
    </div>
  );
};

export default LinkList;
