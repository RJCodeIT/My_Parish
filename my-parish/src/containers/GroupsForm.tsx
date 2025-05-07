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
      
      // Extract the leader ID correctly based on whether it's a string or an object
      let leaderId = "";
      if (typeof initialData.leaderId === 'string') {
        leaderId = initialData.leaderId;
      } else if (initialData.leaderId && typeof initialData.leaderId === 'object') {
        // If leaderId is an object with _id or id property
        leaderId = initialData.leaderId._id || initialData.leaderId.id || '';
        console.log("Extracted leader ID:", leaderId);
      }
      
      // Extract member IDs correctly
      let members: string[] = [];
      if (Array.isArray(initialData.members)) {
        members = initialData.members.map(member => {
          if (typeof member === 'string') {
            return member;
          } else if (member && typeof member === 'object') {
            // If member is an object with _id or id property
            const memberId = member._id || member.id || '';
            console.log("Extracted member ID:", memberId, "from", member);
            return memberId;
          }
          return '';
        }).filter(id => id !== '');
        console.log("Extracted member IDs:", members);
      }
      
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        leaderId: leaderId,
        members: members,
        meetingSchedule: initialData.meetingSchedule || "",
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      alert("Nazwa grupy jest wymagana");
      return;
    }
    
    if (!formData.leaderId) {
      alert("Lider grupy jest wymagany");
      return;
    }
    
    try {
      // Create a copy of the form data to send to the API
      const apiFormData = {
        ...formData,
        // Make sure we're sending the correct ID format to the API
        leaderId: formData.leaderId,
        // Convert member IDs if needed
        members: formData.members
      };
      
      console.log("Prepared data for API:", apiFormData);
      
      if (isEditMode && initialData?._id) {
        const response = await axios.put(`/api/groups/${initialData._id}`, apiFormData);
        console.log("Group update response:", response.data);
        alert("Grupa zaktualizowana!");
        router.push("/admin/dashboard/grupy-parafialne");
      } else {
        console.log("Submitting group data:", apiFormData);
        const response = await axios.post("/api/groups", apiFormData);
        console.log("Group creation response:", response.data);
        alert("Grupa dodana!");
        router.push("/admin/dashboard/grupy-parafialne");
      }
    } catch (error) {
      console.error("Error submitting group:", error);
      
      // Display more specific error message if available
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(`Błąd: ${error.response.data.error}`);
      } else {
        alert("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " grupy.");
      }
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
