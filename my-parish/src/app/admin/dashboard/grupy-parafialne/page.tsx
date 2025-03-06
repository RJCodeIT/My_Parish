"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "@/components/layout/SectionTitle";
import SearchForm from "@/components/ui/SearchForm";
import GroupCard from "@/components/ui/GroupCard";
import { PopulatedGroup } from "@/types";

export default function ParishGroups() {
  const [groups, setGroups] = useState<PopulatedGroup[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("/api/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Błąd pobierania grup:", err);
    }
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter(group => group._id !== id));
  };

  return (
    <div>
      <SectionTitle name="Grupy parafialne" />
      <SearchForm />
      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <GroupCard 
            key={group._id} 
            group={group} 
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
