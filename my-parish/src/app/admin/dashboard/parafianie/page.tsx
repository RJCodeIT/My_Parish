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
  isDeceased?: boolean;
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
  isDeceased?: boolean;
}

export default function Parishioners() {
  const [parishioners, setParishioners] = useState<Parishioner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'living' | 'deceased' | 'all'>('living');
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

  const filteredParishioners = parishioners
    .filter((p) => {
      if (statusFilter === 'all') return true;
      const isDeceased = !!p.isDeceased;
      return statusFilter === 'deceased' ? isDeceased : !isDeceased;
    })
    .filter((parishioner) => {
      const searchStr = `${parishioner.firstName} ${parishioner.lastName} ${parishioner.address.street} ${parishioner.address.city} ${parishioner.phoneNumber ?? ''} ${parishioner.email ?? ''}`.toLowerCase();
      return searchStr.includes(searchQuery);
    });

  const counts = parishioners.reduce(
    (acc, p) => {
      if (p.isDeceased) acc.deceased += 1;
      else acc.living += 1;
      acc.all += 1;
      return acc;
    },
    { living: 0, deceased: 0, all: 0 }
  );

  return (
    <div>
      <SectionTitle name="Parafianie" />
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <AdminSearchBar 
            onSearch={handleSearch}
            placeholder="Szukaj parafian..."
            className="sm:flex-[2] w-full mb-0"
            inputClassName="h-10"
          />
          <div className="sm:flex-[3] w-full flex sm:justify-end">
            <div className="inline-flex rounded-xl shadow-sm border border-gray-200 overflow-hidden h-10">
              <button
                type="button"
                onClick={() => setStatusFilter('living')}
                aria-pressed={statusFilter === 'living'}
                className={`h-10 inline-flex items-center gap-2 px-3 sm:px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${statusFilter === 'living' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-r border-gray-200`}
              >
                <span>Żyjący</span>
                <span className={`${statusFilter === 'living' ? 'text-white/90' : 'text-gray-500'} text-xs`}>({counts.living})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('deceased')}
                aria-pressed={statusFilter === 'deceased'}
                className={`h-10 inline-flex items-center gap-2 px-3 sm:px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${statusFilter === 'deceased' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-r border-gray-200`}
              >
                <span>Zmarli</span>
                <span className={`${statusFilter === 'deceased' ? 'text-white/90' : 'text-gray-500'} text-xs`}>({counts.deceased})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                aria-pressed={statusFilter === 'all'}
                className={`h-10 inline-flex items-center gap-2 px-3 sm:px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <span>Wszyscy</span>
                <span className={`${statusFilter === 'all' ? 'text-white/90' : 'text-gray-500'} text-xs`}>({counts.all})</span>
              </button>
            </div>
          </div>
        </div>
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
