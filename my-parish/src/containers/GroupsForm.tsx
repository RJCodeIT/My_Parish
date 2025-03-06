"use client";
import React, { useState } from "react";
import axios from "axios";
import Input from "@/components/ui/Input";
import SelectParishioner from "@/components/ui/SelectParishioner";

export default function GroupsForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leaderId: "",
    members: [] as string[],
    meetingSchedule: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/groups", formData);
      alert("Grupa dodana!");
      setFormData({
        name: "",
        description: "",
        leaderId: "",
        members: [],
        meetingSchedule: "",
      });
    } catch (error) {
      console.error(error);
      alert("Błąd podczas dodawania grupy.");
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
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600"
      >
        Dodaj grupę
      </button>
    </form>
  );
}
