'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import AdminSearchBar from "@/components/ui/AdminSearchBar";
import GroupCard from "@/components/ui/GroupCard";
import { PopulatedGroup } from "@/types";

export default function ParishGroups() {
  const [groups, setGroups] = useState<PopulatedGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get("/api/groups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/groups/${id}`);
      setGroups(groups.filter((g) => g._id !== id));
    } catch (error) {
      console.error("Error deleting group:", error);
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
          {filteredGroups.map((group) => (
            <GroupCard key={group._id} group={group} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
