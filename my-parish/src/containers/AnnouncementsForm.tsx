"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useAlerts } from "@/components/ui/Alerts";

interface AnnouncementContent {
  order: number;
  text: string;
}

interface Announcement {
  _id?: string;
  title: string;
  date: string;
  content: AnnouncementContent[];
  extraInfo?: string;
}

interface AnnouncementsFormProps {
  initialData?: Announcement;
  isEditMode?: boolean;
}

export default function AnnouncementsForm({ initialData, isEditMode = false }: AnnouncementsFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [content, setContent] = useState<AnnouncementContent[]>([]);
  const router = useRouter();
  const alerts = useAlerts();

  useEffect(() => {
    if (initialData && isEditMode) {
      console.log("Initial announcement data received in form:", initialData);
      setTitle(initialData.title || "");
      // Format date for input field (YYYY-MM-DD)
      if (initialData.date) {
        const formattedDate = new Date(initialData.date).toISOString().split('T')[0];
        setDate(formattedDate);
      }
      setExtraInfo(initialData.extraInfo || "");
      setContent(initialData.content || []);
    }
  }, [initialData, isEditMode]);

  const handleAddAnnouncement = () => {
    setContent([...content, { order: content.length + 1, text: "" }]);
  };

  const handleContentChange = (index: number, value: string) => {
    const updatedContent = [...content];
    updatedContent[index].text = value;
    setContent(updatedContent);
  };

  const handleRemoveAnnouncement = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      alerts.showError("Tytuł ogłoszenia jest wymagany");
      return;
    }
    
    if (content.length === 0 || content.some(item => !item.text.trim())) {
      alerts.showError("Treść ogłoszenia jest wymagana");
      return;
    }

    try {
      let response;
      
      if (isEditMode && initialData?._id) {
        // Prepare the announcement data as JSON
        const announcementData = {
          title,
          date: date || new Date().toISOString(),
          content,
          extraInfo
        };
        
        // Now update the announcement with JSON data
        response = await fetch(`/mojaParafia/api/announcements/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(announcementData)
        });
      } else {
        // For create mode, continue using FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date || new Date().toISOString());
        formData.append("extraInfo", extraInfo);
        formData.append("content", JSON.stringify(content));
        
        response = await fetch('/mojaParafia/api/announcements', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          }
        });
      }
      
      if (response.ok) {
        if (isEditMode) {
          alerts.showSuccess("Ogłoszenie zaktualizowane pomyślnie!");
        } else {
          alerts.showSuccess("Ogłoszenie dodane pomyślnie!");
        }
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push("/admin/dashboard/ogloszenia");
        }, 2000);
      } else {
        try {
          const errorData = await response.json();
          console.error("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " ogłoszenia", errorData);
          alerts.showError(errorData.error || `Wystąpił błąd podczas ${isEditMode ? "aktualizacji" : "dodawania"} ogłoszenia`);
        } catch {
          const errorText = await response.text();
          console.error("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " ogłoszenia", errorText);
          alerts.showError(`Wystąpił błąd podczas ${isEditMode ? "aktualizacji" : "dodawania"} ogłoszenia`);
        }
      }
    } catch (error) {
      console.error("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " ogłoszenia", error);
      alerts.showError(error instanceof Error ? error.message : `Wystąpił błąd podczas ${isEditMode ? "aktualizacji" : "dodawania"} ogłoszenia`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-8"
    >
      <div className="space-y-6">
        <Input
          label="Tytuł"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="Data"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />


      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Ogłoszenia</h3>
          <button
            type="button"
            onClick={handleAddAnnouncement}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            + Dodaj ogłoszenie
          </button>
        </div>
        <div className="space-y-3">
          {content.map((item, index) => (
            <div key={item.order} className="flex items-center space-x-2">
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleContentChange(index, e.target.value)}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder={`Ogłoszenie ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveAnnouncement(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dodatkowe informacje</label>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          className="w-full min-h-[120px] px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          rows={3}
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? "Zapisz zmiany" : "Dodaj ogłoszenie"}
        </button>
      </div>
    </form>
  );
}
