"use client";
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { readFile } from "@/utils/readDocx";

export default function AnnouncementsForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [extraInfo, setExtraInfo] = useState("");
  const [content, setContent] = useState<{ order: number; text: string }[]>([]);
  const router = useRouter();

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsedContent = await readFile(file);
      setTitle(parsedContent.title);
      setContent(parsedContent.content);
      setExtraInfo(parsedContent.extraInfo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date || new Date().toISOString());
    if (image) formData.append("image", image);
    formData.append("extraInfo", extraInfo);
    formData.append("content", JSON.stringify(content));

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        router.push("/admin/dashboard/ogloszenia");
      } else {
        console.error("Błąd podczas dodawania ogłoszenia", await response.text());
      }
    } catch (error) {
      console.error("Błąd podczas dodawania ogłoszenia", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold">Dodaj ogłoszenie</h2>

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

      <div>
        <label className="text-sm font-medium mb-1 block">Dodaj zdjęcie</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Dodaj plik .docx
        </label>
        <input type="file" accept=".docx" onChange={handleFileUpload} />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Ogłoszenia</h3>
        {content.map((item, index) => (
          <div key={item.order} className="flex items-center space-x-2">
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleContentChange(index, e.target.value)}
              className="border p-2 rounded w-full"
              placeholder={`Ogłoszenie ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveAnnouncement(index)}
              className="text-red-500"
            >
              ✖
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAnnouncement}
          className="text-blue-500"
        >
          + Dodaj ogłoszenie
        </button>
      </div>

      <textarea
        placeholder="Dodatkowe informacje"
        value={extraInfo}
        onChange={(e) => setExtraInfo(e.target.value)}
        className="border p-2 rounded w-full h-24"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Dodaj ogłoszenie
      </button>
    </form>
  );
}
