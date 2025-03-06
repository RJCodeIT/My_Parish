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
      router.push("/admin/dashboard/ogloszenia");
    } catch (error) {
      console.error("Błąd podczas dodawania intencji", error);
      setError("Wystąpił błąd podczas dodawania intencji. Spróbuj ponownie.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold">Dodaj intencje mszalne</h2>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Input label="Tytuł" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <Input label="Data" type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <div>
        <label className="text-sm font-medium mb-1 block">Dodaj zdjęcie</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Dodaj plik .docx</label>
        <input type="file" accept=".docx" onChange={handleFileUpload} />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Msze i intencje</h3>
        {masses.map((mass, index) => (
          <div key={index} className="flex items-center space-x-2 w-full">
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
            <div className="w-2/3">
              <label className="text-sm font-medium mb-1 block">Intencja</label>
              <input
                type="text"
                value={mass.intention}
                onChange={(e) => handleMassChange(index, "intention", e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Intencja"
                required
              />
            </div>
            <button type="button" onClick={() => handleRemoveMass(index)} className="text-red-500">✖</button>
          </div>
        ))}
        <button type="button" onClick={handleAddMass} className="text-blue-500">+ Dodaj mszę</button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Dodaj ogłoszenie</button>
    </form>
  );
}
