"use client"
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import IntentionCard from "@/components/ui/IntentionCard";
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

  useEffect(() => {
    axios.get("/mojaParafia/api/intentions")
      .then((response) => {
        setIntentions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching intentions:", error);
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/mojaParafia/api/intentions/${id}`);
      // Po usunięciu pobierz listę intencji ponownie z API
      const response = await axios.get("/mojaParafia/api/intentions");
      setIntentions(response.data);
    } catch (error) {
      console.error("Error deleting intention:", error);
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
      <SectionTitle name="Wszystkie intencje" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Wszystkie Intencje</h1>
        </div>
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
