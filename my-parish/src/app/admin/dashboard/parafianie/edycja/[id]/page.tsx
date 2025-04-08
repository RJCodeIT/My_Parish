"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ParishionersForm from "@/containers/ParishionersForm";
import SectionTitle from "@/components/layout/SectionTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Sacrament {
  type: string;
  date: string;
}

interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

interface ParishionerData {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: Address;
  sacraments: Sacrament[];
  notes: string;
}

export default function EditParishioner({ params }: { params: { id: string } }) {
  const [parishioner, setParishioner] = useState<ParishionerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchParishioner = async () => {
      try {
        const response = await axios.get(`/api/parishioners/${params.id}`);
        console.log("Fetched parishioner data:", response.data);
        setParishioner(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching parishioner:", err);
        setError("Nie udało się pobrać danych parafianina.");
        setLoading(false);
      }
    };

    fetchParishioner();
  }, [params.id]);

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
    <div className="container mx-auto py-8 px-4">
      <SectionTitle name="Edycja parafianina" />
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          &larr; Wróć
        </button>
      </div>
      {parishioner && (
        <ParishionersForm 
          initialData={parishioner} 
          isEditMode={true} 
        />
      )}
    </div>
  );
}
