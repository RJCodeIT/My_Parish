"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import SelectParishioner from "@/components/ui/SelectParishioner";
import { BaseGroup } from "@/types";

interface GroupsFormProps {
  initialData?: BaseGroup;
  isEditMode?: boolean;
}

export default function GroupsForm({ initialData, isEditMode = false }: GroupsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leaderId: "",
    members: [] as string[],
    meetingSchedule: "",
  });

  useEffect(() => {
    if (initialData && isEditMode) {
      console.log("Initial group data received in form:", initialData);
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        leaderId: initialData.leaderId || "",
        members: initialData.members || [],
        meetingSchedule: initialData.meetingSchedule || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && initialData?._id) {
        await axios.put(`/api/groups/${initialData._id}`, formData);
        alert("Grupa zaktualizowana!");
        router.push("/admin/dashboard/grupy-parafialne");
      } else {
        await axios.post("/api/groups", formData);
        alert("Grupa dodana!");
        setFormData({
          name: "",
          description: "",
          leaderId: "",
          members: [],
          meetingSchedule: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " grupy.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      <Input
        label="Nazwa grupy"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Opis"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      <SelectParishioner
        label="Lider grupy"
        value={formData.leaderId}
        onChange={(id) => setFormData({ ...formData, leaderId: id as string })}
      />

      <SelectParishioner
        label="Członkowie"
        multiple
        value={formData.members}
        onChange={(ids) =>
          setFormData({ ...formData, members: ids as string[] })
        }
      />
      <Input
        label="Harmonogram spotkań"
        name="meetingSchedule"
        value={formData.meetingSchedule}
        onChange={handleChange}
      />
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? "Zapisz zmiany" : "Dodaj grupę"}
        </button>
      </div>
    </form>
  );
}
