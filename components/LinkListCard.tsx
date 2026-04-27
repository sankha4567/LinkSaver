"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Trash2, FileText, Edit } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import NextLink from "next/link";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LinkCardProps {
  _id: Id<"links">;
  title: string;
  url: string;
  note?: string;
  createdAt: number;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const LinkListCard = ({ Link }: { Link: LinkCardProps }) => {
  const deleteLink = useMutation(api.links.deleteLink);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const domain = useMemo(() => getDomain(Link.url), [Link.url]);

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteLink({ linkId: Link._id });
      toast.success("Link deleted");
      setConfirmOpen(false);
    } catch {
      toast.error("Failed to delete link");
      setIsDeleting(false);
    }
  }

  return (
    <Card className="group p-5 transition-all duration-200 hover:shadow-md hover:border-ring/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate">{Link.title}</h3>
          <a
            href={Link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1 truncate max-w-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ExternalLink className="size-3.5" />
            <span className="truncate">{domain}</span>
          </a>
        </div>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={`Edit ${Link.title}`}
          >
            <NextLink href={`/update/${Link._id}`}>
              <Edit />
            </NextLink>
          </Button>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${Link.title}`}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this link?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove &ldquo;{Link.title}&rdquo;. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {Link.note && (
        <div className="mt-3 flex items-start gap-2">
          <FileText className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground line-clamp-2">{Link.note}</p>
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">{formatDate(Link.createdAt)}</span>
      </div>
    </Card>
  );
};

export default LinkListCard;
