"use client";

import { useRouter } from "next/navigation";
import SectionTitle from "@/components/layout/SectionTitle";
import GroupsForm from "@/containers/GroupsForm";

export default function AddGroup() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      <SectionTitle name="Dodawanie grupy parafialnej" />
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Wróć
        </button>
      </div>
      <GroupsForm />
    </div>
  );
}
