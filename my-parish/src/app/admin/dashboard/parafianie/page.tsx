"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import ParishionerCard from "@/components/ui/ParishionerCard";

// Interface for the API response from Prisma
interface ParishionerApiResponse {
  id: string;
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

// Interface for the component's internal state
interface Parishioner {
  _id: string; // This is mapped from id for compatibility with components
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get("/mojaParafia/api/parishioners")
      .then((response) => {
        // Map the API response to include _id field for compatibility
        const mappedData = response.data.map((item: ParishionerApiResponse) => ({
          ...item,
          _id: item.id // Add _id field that matches the id from Prisma
        }));
        setParishioners(mappedData);
      })
      .catch((error) => {
        console.error("Błąd pobierania parafian:", error);
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/mojaParafia/api/parishioners/${id}`);
      setParishioners((prev) => prev.filter((p) => p._id !== id));
      alert("Parafianin został usunięty.");
    } catch (error) {
      console.error("Błąd podczas usuwania parafianina:", error);
      alert("Nie udało się usunąć parafianina.");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredParishioners = parishioners.filter((parishioner) => {
    const searchStr = `${parishioner.firstName} ${parishioner.lastName} ${parishioner.address.street} ${parishioner.address.city} ${parishioner.phoneNumber} ${parishioner.email}`.toLowerCase();
    return searchStr.includes(searchQuery);
  });

  return (
    <div>
      <SectionTitle name="Parafianie" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Wszyscy Parafianie</h1>
        </div>
        <AdminSearchBar 
          onSearch={handleSearch}
          placeholder="Szukaj po imieniu, nazwisku, adresie lub emailu..."
        />
        <div className="mt-4 space-y-4">
          {filteredParishioners.map((parishioner) => (
            <ParishionerCard key={parishioner._id} parishioner={parishioner} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
