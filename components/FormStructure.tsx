import Navbar from "./Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LinkForm from "./LinkForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LinkDoc } from "@/lib/types";

const FormStructure = ({ initialData }: { initialData?: LinkDoc }) => {
  const isEdit = Boolean(initialData?._id);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" />
          Back to links
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEdit ? "Edit Link" : "Create New Link"}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? "Update the title, URL, or note for this link."
                : "Save a new link with a title and optional note."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkForm initialData={initialData} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FormStructure;
