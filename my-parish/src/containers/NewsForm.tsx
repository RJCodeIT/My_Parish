"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { readFile } from "@/utils/readDocx";
import Image from "next/image";

interface NewsData {
  _id?: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
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
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setContent(initialData.content || "");
      setExistingImage(initialData.imageUrl);
    }
  }, [isEditMode, initialData]);

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

    try {
      if (isEditMode && initialData?._id) {
        // For edit mode, handle the image upload separately
        // First, prepare the news data as JSON
        const newsData = {
          title,
          subtitle,
          content,
          imageUrl: existingImage // Keep existing image URL if no new image
        };
        
        // If there's a new image, upload it first
        if (image) {
          const imageFormData = new FormData();
          imageFormData.append("image", image);
          
          const imageUploadResponse = await fetch('/mojaParafia/api/upload', {
            method: 'POST',
            body: imageFormData
          });
          
          if (imageUploadResponse.ok) {
            const imageData = await imageUploadResponse.json();
            newsData.imageUrl = imageData.imageUrl;
          } else {
            throw new Error("Failed to upload image");
          }
        }
        
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
          alert("Aktualność zaktualizowana pomyślnie!");
          router.push("/admin/dashboard/aktualnosci");
        } else {
          const errorText = await fetchResponse.text();
          console.error("Błąd podczas aktualizacji aktualności", errorText);
          setError("Wystąpił błąd podczas aktualizacji aktualności");
        }
      } else {
        // For create mode, continue using FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("content", content);
        if (image) formData.append("image", image);

        const response = await axios.post("/mojaParafia/api/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (response.status === 201) {
          alert("Aktualność dodana pomyślnie!");
          router.push("/admin/dashboard/aktualnosci");
        } else {
          setError("Wystąpił błąd podczas dodawania aktualności");
        }
      }
    } catch (error) {
      console.error("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " aktualności", error);
      setError("Wystąpił błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " aktualności");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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

        {existingImage && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Aktualne zdjęcie</label>
            <div className="relative h-40 w-full max-w-md rounded-lg overflow-hidden">
              <Image 
                src={existingImage} 
                alt="Aktualne zdjęcie" 
                className="object-cover"
                fill
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {existingImage ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Wybierz plik
            </button>
            <span className="text-sm text-gray-500">
              {image ? image.name : "Nie wybrano pliku"}
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dodaj plik .docx</label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => document.getElementById('docx-upload')?.click()}
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Wybierz plik
            </button>
            <span className="text-sm text-gray-500">Nie wybrano pliku</span>
            <input 
              id="docx-upload"
              type="file" 
              accept=".docx" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

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
