"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAlerts } from "@/components/ui/Alerts";

interface NewsData {
  _id?: string;
  title: string;
  subtitle: string;
  content: string;
  date?: string;
}

interface NewsFormProps {
  initialData?: NewsData;
  isEditMode?: boolean;
}

export default function NewsForm({ initialData, isEditMode = false }: NewsFormProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const alerts = useAlerts();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setContent(initialData.content || "");
    }
  }, [isEditMode, initialData]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      alerts.showError("Tytuł aktualności jest wymagany");
      return;
    }
    
    if (!subtitle.trim()) {
      alerts.showError("Podtytuł aktualności jest wymagany");
      return;
    }
    
    if (!content.trim()) {
      alerts.showError("Treść aktualności jest wymagana");
      return;
    }

    try {
      if (isEditMode && initialData?._id) {
        // Prepare the news data as JSON
        const newsData = {
          title,
          subtitle,
          content
        };
        
        // Now update the news with JSON data
        const fetchResponse = await fetch(`/mojaParafia/api/news/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(newsData)
        });
        
        if (fetchResponse.ok) {
          alerts.showSuccess("Aktualność zaktualizowana pomyślnie!");
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            router.push("/admin/dashboard/aktualnosci");
          }, 2000);
        } else {
          try {
            const errorData = await fetchResponse.json();
            console.error("Błąd podczas aktualizacji aktualności", errorData);
            alerts.showError(errorData.error || "Wystąpił błąd podczas aktualizacji aktualności. Spróbuj ponownie.");
          } catch {
            const errorText = await fetchResponse.text();
            console.error("Błąd podczas aktualizacji aktualności", errorText);
            alerts.showError("Wystąpił błąd podczas aktualizacji aktualności. Spróbuj ponownie.");
          }
        }
      } else {
        // For create mode, continue using FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("content", content);

        const response = await axios.post("/mojaParafia/api/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (response.status === 201) {
          alerts.showSuccess("Aktualność dodana pomyślnie!");
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            router.push("/admin/dashboard/aktualnosci");
          }, 2000);
        } else {
          alerts.showError("Wystąpił błąd podczas dodawania aktualności. Spróbuj ponownie.");
        }
      }
    } catch (error) {
      console.error("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " aktualności", error);
      alerts.showError(`Wystąpił błąd podczas ${isEditMode ? "aktualizacji" : "dodawania"} aktualności. Spróbuj ponownie.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-8">

      <div className="space-y-6">
        <Input 
          label="Tytuł" 
          name="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />

        <Input 
          label="Podtytuł" 
          name="subtitle" 
          value={subtitle} 
          onChange={(e) => setSubtitle(e.target.value)} 
          required 
        />



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Treść</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[160px] px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            placeholder="Treść aktualności..."
            required
            rows={6}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? "Zaktualizuj aktualność" : "Dodaj aktualność"}
        </button>
      </div>
    </form>
  );
}
