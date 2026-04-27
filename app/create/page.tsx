"use client";

import AuthGate from "@/components/AuthGate";
import FormStructure from "@/components/FormStructure";

export default function CreatePage() {
  return (
    <AuthGate>
      <FormStructure initialData={undefined} />
    </AuthGate>
  );
}
