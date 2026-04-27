"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AuthGate from "@/components/AuthGate";
import FormStructure from "@/components/FormStructure";
import { FullPageSpinner } from "@/components/Spinner";

function UpdatePageContent() {
  const params = useParams<{ Id: string }>();
  const linkId = params.Id as Id<"links">;
  const link = useQuery(api.links.getLinkById, { linkId });
  const router = useRouter();

  useEffect(() => {
    if (link === null) {
      router.replace("/");
    }
  }, [link, router]);

  if (link === undefined || link === null) {
    return <FullPageSpinner />;
  }

  return <FormStructure initialData={link} />;
}

export default function UpdatePage() {
  return (
    <AuthGate>
      <UpdatePageContent />
    </AuthGate>
  );
}
