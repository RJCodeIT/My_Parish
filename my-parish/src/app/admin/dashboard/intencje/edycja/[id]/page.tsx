"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import IntentionsForm from "@/containers/IntentionsForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Interfejs dla danych intencji z API
interface Intention {
  _id: string;
  title: string;
  date: string;
  weekStart?: string;
  weekEnd?: string;
  imageUrl?: string;
  masses?: Array<{
    time: string;
    intention: string;
  }>;
  days?: Array<{
    date: string;
    masses: Array<{
      time: string;
      intentions?: Array<{ intention: string }>;
      intention?: string;
    }>;
  }>;
}

export default function EditIntention() {
  // Use useParams hook to get the ID
  const params = useParams();
  const intentionId = params.id as string;
  
  const [intention, setIntention] = useState<Intention | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIntention = async () => {
      try {
        const response = await axios.get(`/mojaParafia/api/intentions/${intentionId}`);
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

  // Przygotuj dane dla formularza, uzupełniając brakujące pola
  const prepareInitialData = (intention: Intention) => {
    // Upewnij się, że wszystkie wymagane pola są ustawione
    const weekStartDate = intention.weekStart ? new Date(intention.weekStart) : new Date(intention.date);
    const weekEndDate = intention.weekEnd ? new Date(intention.weekEnd) : (() => {
      const date = new Date(intention.date);
      date.setDate(date.getDate() + 6);
      return date;
    })();
    
    // Przygotuj dane w formacie zgodnym z IntentionsForm
    const formattedData = {
      _id: intention._id,
      title: intention.title,
      date: intention.date,
      weekStart: weekStartDate.toISOString().split('T')[0],
      weekEnd: weekEndDate.toISOString().split('T')[0],
      imageUrl: intention.imageUrl,
    };
    
    // Przygotuj dni z mszami i intencjami
    if (intention.days && intention.days.length > 0) {
      // Jeśli już mamy dni w nowym formacie
      return {
        ...formattedData,
        days: intention.days.map(day => ({
          date: day.date,
          masses: day.masses.map(mass => ({
            time: mass.time,
            intentions: mass.intentions || (mass.intention ? [{ intention: mass.intention }] : [{ intention: '' }])
          }))
        }))
      };
    } else if (intention.masses && intention.masses.length > 0) {
      // Jeśli mamy stary format z pojedynczą listą mszy
      return {
        ...formattedData,
        days: [
          {
            date: intention.date,
            masses: intention.masses.map(mass => ({
              time: mass.time,
              intentions: [{ intention: mass.intention }]
            }))
          }
        ]
      };
    } else {
      // Jeśli nie mamy ani dni, ani mszy, utwórz pustą strukturę
      return {
        ...formattedData,
        days: [
          {
            date: intention.date,
            masses: [{ time: '', intentions: [{ intention: '' }] }]
          }
        ]
      };
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Edytuj intencję</h1>
      {intention && <IntentionsForm initialData={prepareInitialData(intention)} isEditMode={true} />}
    </div>
  );
}
