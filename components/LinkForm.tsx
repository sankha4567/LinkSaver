"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { linkSchema, type LinkSchema } from "@/lib/validations";
import { api } from "@/convex/_generated/api";
import type { LinkDoc } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const LinkForm = ({ initialData }: { initialData?: LinkDoc }) => {
  const isEdit = Boolean(initialData?._id);
  const form = useForm<LinkSchema>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      url: initialData?.url ?? "",
      note: initialData?.note ?? "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title ?? "",
        url: initialData.url ?? "",
        note: initialData.note ?? "",
      });
    }
  }, [initialData, reset]);

  const createLink = useMutation(api.links.createLink);
  const updateLink = useMutation(api.links.updateLink);
  const router = useRouter();

  const handleClearAll = () => {
    reset({ title: "", url: "", note: "" });
  };

  async function onSubmit(data: LinkSchema) {
    try {
      if (initialData?._id) {
        await updateLink({
          linkId: initialData._id,
          title: data.title,
          url: data.url,
          note: data.note,
        });
        toast.success("Link updated");
      } else {
        await createLink({
          title: data.title,
          url: data.url,
          note: data.note,
        });
        toast.success("Link created");
      }
      reset();
      router.push("/");
    } catch {
      toast.error(isEdit ? "Failed to update link" : "Failed to create link");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My favorite article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input placeholder="Optional note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearAll}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Link"
                : "Create Link"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LinkForm;
