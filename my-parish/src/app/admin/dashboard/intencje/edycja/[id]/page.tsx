"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import IntentionsForm from "@/containers/IntentionsForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Intention {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  masses: Array<{
    time: string;
    intention: string;
  }>;
}

export default function EditIntention({ params }: { params: { id: string } }) {
  // Use React.use() to unwrap the params object
  const unwrappedParams = React.use(Promise.resolve(params));
  const intentionId = unwrappedParams.id;
  
  const [intention, setIntention] = useState<Intention | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIntention = async () => {
      try {
        const response = await axios.get(`/api/intentions/${intentionId}`);
        setIntention(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania intencji:", error);
        setError("Nie udało się pobrać danych intencji. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    fetchIntention();
  }, [intentionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Edytuj intencję</h1>
      {intention && <IntentionsForm initialData={intention} isEditMode={true} />}
    </div>
  );
}
