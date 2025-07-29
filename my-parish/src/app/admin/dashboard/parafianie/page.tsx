"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import ParishionerCard from "@/components/ui/ParishionerCard";
import { useAlerts } from "@/components/ui/Alerts";

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
  const alerts = useAlerts();

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
      alerts.showSuccess("Parafianin został usunięty.");
    } catch (error) {
      console.error("Błąd podczas usuwania parafianina:", error);
      
      // Sprawdzamy, czy błąd dotyczy przynależności do grupy parafialnej
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        
        if (responseData.error === "Parishioner belongs to a group" && responseData.groupName) {
          alerts.showError(`Nie udało się usunąć parafianina, ponieważ należy do grupy parafialnej: ${responseData.groupName}`);
          return;
        }
        
        if (responseData.error === "Parishioner is a leader of a group" && responseData.groupName) {
          alerts.showError(`Nie udało się usunąć parafianina, ponieważ jest liderem grupy parafialnej: ${responseData.groupName}`);
          return;
        }
      }
      
      // Ogólny komunikat błędu, jeśli nie jest to specyficzny przypadek
      alerts.showError("Nie udało się usunąć parafianina.");
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
      <div className="p-3 sm:p-4 md:p-6">
        <AdminSearchBar 
          onSearch={handleSearch}
          placeholder="Szukaj parafian..."
        />
        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          {filteredParishioners.length > 0 ? (
            filteredParishioners.map((parishioner) => (
              <ParishionerCard key={parishioner._id} parishioner={parishioner} onDelete={handleDelete} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">Brak parafian</div>
          )}
        </div>
      </div>
    </div>
  );
}
