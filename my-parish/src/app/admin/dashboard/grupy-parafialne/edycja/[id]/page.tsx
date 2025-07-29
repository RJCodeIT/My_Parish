"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import GroupsForm from "@/containers/GroupsForm";
import SectionTitle from "@/components/layout/SectionTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BaseGroup } from "@/types";

export default function EditGroup() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  
  const [group, setGroup] = useState<BaseGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId) {
        setError("Nie znaleziono identyfikatora grupy");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/mojaParafia/api/groups/${groupId}`);
        console.log("Fetched group data:", response.data);
        setGroup(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Nie udało się pobrać danych grupy parafialnej.");
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Błąd</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
        >
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-8">
      <SectionTitle name="Edycja grupy parafialnej" />
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto justify-center sm:justify-start mt-8 sm:mt-0"
        >
          <span className="mr-1">&larr;</span> Wróć
        </button>
      </div>
      {group && <GroupsForm initialData={group} isEditMode={true} />}
    </div>
  );
}
