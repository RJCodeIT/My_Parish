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
        console.log('Fetching intention with ID:', intentionId);
        // Używamy poprawnej ścieżki API zgodnie z konfiguracją projektu
        const response = await axios.get(`/mojaParafia/api/intentions/${intentionId}`);
        console.log('Received intention data:', response.data);
        console.log('Days from API:', JSON.stringify(response.data.days));
        
        // Upewnij się, że niedziela jest w danych
        if (response.data.days && Array.isArray(response.data.days)) {
          const sundayData = response.data.days.find(day => day.date === "2025-06-08");
          console.log('Sunday data:', sundayData);
        }
        
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

  // Przygotuj dane dla formularza, dokładnie tak jak są w intencji
  const prepareInitialData = (intention: Intention) => {
    console.log('Preparing initial data for intention:', intention);
    
    // Użyj dokładnie tych dat, które są w intencji, bez żadnych modyfikacji
    // Nie formatuj, nie modyfikuj, nie zmieniaj dat - użyj ich dokładnie tak, jak są
    const formattedData = {
      _id: intention._id,
      title: intention.title,
      date: intention.date,
      weekStart: intention.weekStart || intention.date, // Fallback do daty intencji, jeśli weekStart nie istnieje
      weekEnd: intention.weekEnd || intention.date, // Fallback do daty intencji, jeśli weekEnd nie istnieje
      imageUrl: intention.imageUrl,
    };
    
    // Upewnij się, że mamy wszystkie dni tygodnia, w tym niedzielę
    if (intention.days && intention.days.length > 0) {
      // Posortuj dni według daty
      const sortedDays = [...intention.days].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      
      // Znajdź datę niedzieli (ostatni dzień tygodnia)
      let sundayDate = "";
      if (intention.weekStart && intention.weekEnd) {
        // Jeśli mamy daty początku i końca tygodnia, użyj daty końca jako niedzieli
        sundayDate = intention.weekEnd;
      } else if (sortedDays.length > 0) {
        // Jeśli mamy dni, znajdź ostatni dzień (niedziela)
        const firstDate = new Date(sortedDays[0].date);
        const sunday = new Date(firstDate);
        // Oblicz datę niedzieli (jeśli pierwszy dzień to poniedziałek, dodaj 6 dni)
        sunday.setDate(firstDate.getDate() + 6);
        sundayDate = sunday.toISOString().split('T')[0];
      }
      
      console.log('Data niedzieli:', sundayDate);
      
      // Sprawdź, czy mamy niedzielę w danych
      const hasSunday = intention.days.some(day => {
        const dayDate = new Date(day.date);
        const sundayDateObj = new Date(sundayDate);
        return dayDate.getDate() === sundayDateObj.getDate() && 
               dayDate.getMonth() === sundayDateObj.getMonth() && 
               dayDate.getFullYear() === sundayDateObj.getFullYear();
      });
      
      console.log('Czy mamy niedzielę w danych:', hasSunday);
      
      // Przygotuj dni z intencjami
      const days = intention.days.map(day => ({
        date: day.date,
        masses: day.masses.map(mass => ({
          time: mass.time,
          intentions: mass.intentions || (mass.intention ? [{ intention: mass.intention }] : [{ intention: '' }])
        }))
      }));
      
      // Jeśli nie mamy niedzieli, dodaj ją z 3 mszami i pustymi intencjami
      if (!hasSunday && sundayDate) {
        console.log('Dodaję niedzielę z 3 mszami');
        days.push({
          date: sundayDate,
          masses: [
            { time: "7:30", intentions: [{ intention: "" }] },
            { time: "11:00", intentions: [{ intention: "" }] },
            { time: "18:30", intentions: [{ intention: "" }] }
          ]
        });
      }
      
      return {
        ...formattedData,
        days: days
      };
    } 
    // Jeśli mamy stary format z pojedynczą listą mszy
    else if (intention.masses && intention.masses.length > 0) {
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
    } 
    // Jeśli nie mamy ani dni, ani mszy
    else {
      return {
        ...formattedData,
        days: [
          {
            date: intention.date,
            masses: []
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
