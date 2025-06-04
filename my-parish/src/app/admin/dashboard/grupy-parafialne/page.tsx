'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import GroupCard from "@/components/ui/GroupCard";
import { useAlerts } from "@/components/ui/Alerts";
import { PopulatedGroup } from "@/types";

export default function ParishGroups() {
  const [groups, setGroups] = useState<PopulatedGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const alerts = useAlerts();

  useEffect(() => {
    axios.get("/mojaParafia/api/groups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        alerts.showError("Nie udało się pobrać grup parafialnych. Odśwież stronę i spróbuj ponownie.");
      });
  }, [alerts]);

  const handleDelete = async (id: string) => {
    if (!id) {
      alerts.showError("Nie można usunąć grupy: brak identyfikatora");
      return;
    }
    
    console.log("Attempting to delete group with ID:", id);
    
    try {
      // Use fetch instead of axios for better compatibility
      const response = await fetch(`/mojaParafia/api/groups/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete group');
      }
      
      const data = await response.json();
      console.log("Delete response:", data);
      
      // Update the UI by removing the deleted group
      setGroups(prev => prev.filter(group => {
        // Handle different ID formats
        const groupId = group._id || group.id;
        return String(groupId) !== String(id);
      }));
      
      alerts.showSuccess("Grupa została usunięta pomyślnie.");
      
      // Fetch updated groups list after a short delay
      setTimeout(async () => {
        try {
          const refreshResponse = await fetch("/mojaParafia/api/groups");
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setGroups(refreshData);
          }
        } catch (fetchError) {
          console.error("Error refreshing groups after deletion:", fetchError);
          // Already updated UI above, so no need to handle this error
        }
      }, 500);
    } catch (error) {
      console.error("Error deleting group:", error);
      alerts.showError(error instanceof Error ? error.message : "Nie udało się usunąć grupy. Sprawdź, czy nie ma w niej członków.");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredGroups = groups.filter((group) => {
    const searchStr = `${group.name} ${group.description} ${group.leaderId}`.toLowerCase();
    return searchStr.includes(searchQuery);
  });

  return (
    <div>
      <SectionTitle name="Grupy Parafialne" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Wszystkie Grupy</h1>
        </div>
        <AdminSearchBar 
          onSearch={handleSearch}
          placeholder="Szukaj po nazwie grupy, opisie lub prowadzącym..."
        />
        <div className="mt-4 space-y-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <GroupCard key={group._id} group={group} onDelete={handleDelete} />
            ))
          ) : (
            <div className="text-center text-gray-500">Brak grup parafialnych</div>
          )}
        </div>
      </div>
    </div>
  );
}
