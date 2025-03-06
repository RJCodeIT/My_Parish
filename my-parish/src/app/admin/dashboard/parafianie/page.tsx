"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import SearchForm from "@/components/ui/SearchForm";
import ParishionerCard from "@/components/ui/ParishionerCard";

interface Parishioner {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  phoneNumber?: string;
  email?: string;
  notes?: string;
  sacraments: { type: string; date: string }[];
}

export default function Parishioners() {
  const [parishioners, setParishioners] = useState<Parishioner[]>([]);

  useEffect(() => {
    axios.get("/api/parishioners")
      .then((res) => setParishioners(res.data))
      .catch((err) => console.error("Błąd pobierania parafian:", err));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/parishioners/${id}`);
      setParishioners((prev) => prev.filter((p) => p._id !== id));
      alert("Parafianin został usunięty.");
    } catch (error) {
      console.error("Błąd podczas usuwania parafianina:", error);
      alert("Nie udało się usunąć parafianina.");
    }
  };

  return (
    <div>
      <SectionTitle name="Parafianie" />
      <SearchForm />
      <div className="mt-4 space-y-4">
        {parishioners.map((parishioner) => (
          <ParishionerCard key={parishioner._id} parishioner={parishioner} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
