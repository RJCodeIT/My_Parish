"use client"
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import IntentionCard from "@/components/ui/IntentionCard";
import { useAlerts } from "@/components/ui/Alerts";
import axios from "axios";

interface Mass {
  time: string;
  intention: string;
}

interface Intention {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  masses: Mass[];
}

export default function Intentions() {
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const alerts = useAlerts();

  useEffect(() => {
    axios.get("/mojaParafia/api/intentions")
      .then((response) => {
        setIntentions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching intentions:", error);
        alerts.showError("Nie udało się pobrać intencji. Odśwież stronę i spróbuj ponownie.");
      });
  }, [alerts]);

  const handleDelete = async (id: string) => {
    if (!id) {
      alerts.showError("Nie można usunąć intencji: brak identyfikatora");
      return;
    }
    
    try {
      const response = await axios.delete(`/mojaParafia/api/intentions/${id}`);
      console.log("Delete response:", response.data);
      
      // Update the UI by removing the deleted intention
      setIntentions(prev => prev.filter(intention => intention._id !== id));
      
      alerts.showSuccess("Intencja została usunięta pomyślnie.");
      
      // Fetch updated intentions list after a short delay
      setTimeout(async () => {
        try {
          const refreshResponse = await axios.get("/mojaParafia/api/intentions");
          setIntentions(refreshResponse.data);
        } catch (fetchError) {
          console.error("Error refreshing intentions after deletion:", fetchError);
          // Already updated UI above, so no need to handle this error
        }
      }, 500);
    } catch (error) {
      console.error("Error deleting intention:", error);
      
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alerts.showError(`Nie udało się usunąć intencji: ${error.response.data.error}`);
      } else {
        alerts.showError("Nie udało się usunąć intencji. Spróbuj ponownie.");
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredIntentions = intentions.filter((intention) => {
    const searchStr = `${intention.title} ${intention.date}`.toLowerCase();
    return searchStr.includes(searchQuery);
  });

  return (
    <div>
      <SectionTitle name="Intencje mszalne" />
      <div className="p-6">
        <AdminSearchBar 
          onSearch={handleSearch}
          placeholder="Szukaj w intencjach..."
        />
        <div className="mt-4 space-y-4">
          {filteredIntentions.length > 0 ? (
            filteredIntentions.map((intention) => (
              <IntentionCard 
                key={intention._id} 
                intention={intention} 
                onDelete={handleDelete} 
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Brak intencji</p>
          )}
        </div>
      </div>
    </div>
  );
}
