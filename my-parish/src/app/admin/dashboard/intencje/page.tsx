"use client"
import React, { useEffect, useState } from "react";
import SectionTitle from "@/components/layout/SectionTitle";
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

  useEffect(() => {
    const fetchIntentions = async () => {
      try {
        const { data } = await axios.get("/api/intentions");
        setIntentions(data);
      } catch (error) {
        console.error("Błąd podczas pobierania intencji:", error);
      }
    };

    fetchIntentions();
  }, []);

  const handleDelete = (id: string) => {
    setIntentions((prev) => prev.filter((intention) => intention._id !== id));
  };

  return (
    <div>
      <SectionTitle name="Wszystkie intencje" />
      <div className="mt-4">
        {intentions.length > 0 ? (
          intentions.map((intention) => (
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
  );
}
