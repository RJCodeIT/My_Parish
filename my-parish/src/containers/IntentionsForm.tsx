"use client"
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { readFile } from "@/utils/readDocx";

export default function IntentionsForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [masses, setMasses] = useState<{ time: string; intention: string }[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddMass = () => {
    setMasses([...masses, { time: "", intention: "" }]);
  };

  const handleMassChange = (index: number, field: "time" | "intention", value: string) => {
    const updatedMasses = [...masses];
    updatedMasses[index][field] = value;
    setMasses(updatedMasses);
  };

  const handleRemoveMass = (index: number) => {
    setMasses(masses.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsedContent = await readFile(file);
      setTitle(parsedContent.title);
      setMasses(parsedContent.content.map((text) => ({ time: "", intention: text.text })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date || new Date().toISOString());
    if (image) formData.append("image", image);
    formData.append("masses", JSON.stringify(masses));

    try {
      await axios.post("/api/intentions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/admin/dashboard/intencje");
    } catch (error) {
      console.error("Błąd podczas dodawania intencji", error);
      setError("Wystąpił błąd podczas dodawania intencji. Spróbuj ponownie.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="space-y-8">
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

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Dodaj zdjęcie</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full text-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-neutral/10 file:text-sm file:font-medium hover:file:border-neutral/20 file:bg-gray-50"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Dodaj plik .docx</label>
            <input 
              type="file" 
              accept=".docx" 
              onChange={handleFileUpload}
              className="w-full text-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-neutral/10 file:text-sm file:font-medium hover:file:border-neutral/20 file:bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-neutral/10 pb-4">
          <h3 className="text-lg font-medium text-gray-900">Msze i intencje</h3>
          <button 
            type="button" 
            onClick={handleAddMass} 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj mszę
          </button>
        </div>

        <div className="space-y-6">
          {masses.map((mass, index) => (
            <div key={index} className="flex items-start space-x-4 bg-gray-50/50 p-6 rounded-xl">
              <div className="w-1/3">
                <Input
                  label="Godzina"
                  name={`time-${index}`}
                  value={mass.time}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(/[^0-9:.]/g, "");
                    handleMassChange(index, "time", filteredValue);
                  }}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Intencja</label>
                <div className="flex items-start space-x-3">
                  <input
                    type="text"
                    value={mass.intention}
                    onChange={(e) => handleMassChange(index, "intention", e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-neutral/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Intencja"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveMass(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2.5 hover:bg-white rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          type="submit" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          Dodaj intencję
        </button>
      </div>
    </form>
  );
}
