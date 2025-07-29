"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ParishionersForm from "@/containers/ParishionersForm";
import SectionTitle from "@/components/layout/SectionTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
// Import useParams hook from next/navigation
import { useParams } from "next/navigation";

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

export default function EditParishioner() {
  // Use the useParams hook to get route parameters - this is the recommended approach in Next.js App Router
  const params = useParams();
  const parishionerId = params.id as string;
  
  const [parishioner, setParishioner] = useState<ParishionerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchParishioner = async () => {
      if (!parishionerId) {
        console.error("Missing parishioner ID");
        setError("Brak ID parafianina.");
        setLoading(false);
        return;
      }

      console.log("Fetching parishioner with ID:", parishionerId);
      
      try {
        const response = await axios.get(`/mojaParafia/api/parishioners/${parishionerId}`);
        console.log("Fetched parishioner data:", response.data);
        
        // Map the API response to match the expected format in ParishionersForm
        // The form expects _id but the API returns id
        const mappedData = {
          ...response.data,
          _id: response.data.id // Add _id field that matches the id
        };
        
        setParishioner(mappedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching parishioner:", err);
        setError("Nie udało się pobrać danych parafianina.");
        setLoading(false);
      }
    };

    fetchParishioner();
  }, [parishionerId]);

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
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <SectionTitle name="Edycja parafianina" />
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto justify-center sm:justify-start mt-8 sm:mt-0"
        >
          <span className="mr-1">&larr;</span> Wróć
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
