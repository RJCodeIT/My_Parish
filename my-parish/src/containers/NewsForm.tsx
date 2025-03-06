"use client";
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { readFile } from "@/utils/readDocx";

export default function NewsForm() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsedContent = await readFile(file);
      setTitle(parsedContent.title);
      setContent(parsedContent.content.map((c) => c.text).join("\n\n"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("/api/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.status === 201) {
        router.push("/admin/dashboard/aktualnosci");
      } else {
        setError("Wystąpił błąd podczas dodawania aktualności");
      }
    } catch (error) {
      console.error("Błąd podczas dodawania aktualności", error);
      setError("Wystąpił błąd podczas dodawania aktualności");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold">Dodaj aktualność</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input label="Tytuł" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <Input label="Podtytuł" name="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />

      <div>
        <label className="text-sm font-medium mb-1 block">Dodaj zdjęcie</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Dodaj plik .docx</label>
        <input type="file" accept=".docx" onChange={handleFileUpload} />
      </div>

      <label className="text-sm font-medium mb-1 block">Treść</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded w-full h-40"
        placeholder="Treść aktualności..."
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Dodaj aktualność
      </button>
    </form>
  );
}
