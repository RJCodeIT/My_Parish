"use client"
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAlerts } from "@/components/ui/Alerts";
import { readFile } from "@/utils/readDocx";
import Image from 'next/image';

interface MassIntention {
  id?: string;
  intention: string;
}

interface Mass {
  id?: string;
  time: string;
  intentions: MassIntention[];
}

interface Day {
  id?: string;
  date: string;
  masses: Mass[];
}

interface IntentionData {
  _id?: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  imageUrl?: string;
  days: Day[];
}

interface IntentionsFormProps {
  initialData?: IntentionData;
  isEditMode?: boolean;
}

export default function IntentionsForm({ initialData, isEditMode = false }: IntentionsFormProps) {
  const [title, setTitle] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>("");
  const [days, setDays] = useState<Day[]>([]);
  const router = useRouter();
  const alerts = useAlerts();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      
      // Format dates for input fields (YYYY-MM-DD)
      if (initialData.weekStart) {
        const startDateObj = new Date(initialData.weekStart);
        const formattedStartDate = startDateObj.toISOString().split('T')[0];
        setWeekStart(formattedStartDate);
      }
      
      if (initialData.weekEnd) {
        const endDateObj = new Date(initialData.weekEnd);
        const formattedEndDate = endDateObj.toISOString().split('T')[0];
        setWeekEnd(formattedEndDate);
      }
      
      setExistingImage(initialData.imageUrl);
      setDays(initialData.days || []);
    }
  }, [isEditMode, initialData]);
  
  // Initialize empty week when weekStart changes
  useEffect(() => {
    if (weekStart && !isEditMode && days.length === 0) {
      generateEmptyWeek(weekStart);
    }
  }, [weekStart, isEditMode, days.length]);
  
  // Generate an empty week structure based on the start date
  const generateEmptyWeek = (startDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // 7 days including start date
    
    setWeekEnd(endDate.toISOString().split('T')[0]);
    
    const newDays: Day[] = [];
    
    // Create 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      newDays.push({
        date: currentDate.toISOString().split('T')[0],
        masses: []
      });
    }
    
    setDays(newDays);
  };

  // Add a new mass to a specific day
  const handleAddMass = (dayIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].masses.push({
      time: "",
      intentions: [{ intention: "" }]
    });
    setDays(updatedDays);
  };

  // Add a new intention to a specific mass
  const handleAddIntention = (dayIndex: number, massIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].masses[massIndex].intentions.push({ intention: "" });
    setDays(updatedDays);
  };

  // Update mass time
  const handleMassTimeChange = (dayIndex: number, massIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].masses[massIndex].time = value;
    setDays(updatedDays);
  };

  // Update intention text
  const handleIntentionChange = (dayIndex: number, massIndex: number, intentionIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].masses[massIndex].intentions[intentionIndex].intention = value;
    setDays(updatedDays);
  };

  // Remove a mass from a specific day
  const handleRemoveMass = (dayIndex: number, massIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].masses.splice(massIndex, 1);
    setDays(updatedDays);
  };

  // Remove an intention from a specific mass
  const handleRemoveIntention = (dayIndex: number, massIndex: number, intentionIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].masses[massIndex].intentions.splice(intentionIndex, 1);
    setDays(updatedDays);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsedContent = await readFile(file);
      setTitle(parsedContent.title);
      
      // If we have a weekStart date and days array
      if (weekStart && days.length > 0) {
        // Add parsed intentions to the first day and first mass
        const updatedDays = [...days];
        
        // If there's no mass in the first day, add one
        if (updatedDays[0].masses.length === 0) {
          updatedDays[0].masses.push({
            time: "",
            intentions: []
          });
        }
        
        // Add parsed intentions to the first mass of the first day
        updatedDays[0].masses[0].intentions = parsedContent.content.map((text) => ({
          intention: text.text
        }));
        
        setDays(updatedDays);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      alerts.showError("Tytuł intencji jest wymagany");
      return;
    }
    
    if (!weekStart) {
      alerts.showError("Data początkowa tygodnia jest wymagana");
      return;
    }
    
    if (!weekEnd) {
      alerts.showError("Data końcowa tygodnia jest wymagana");
      return;
    }
    
    // Check if there's at least one day with at least one mass with at least one intention
    const hasValidIntention = days.some(day => 
      day.masses.some(mass => 
        mass.time.trim() && mass.intentions.some(intention => intention.intention.trim())
      )
    );
    
    if (!hasValidIntention) {
      alerts.showError("Dodaj przynajmniej jedną mszę z intencją");
      return;
    }

    try {
      if (isEditMode && initialData?._id) {
        // For edit mode, handle the image upload separately
        // First, prepare the intention data as JSON
        const intentionData = {
          title,
          weekStart: weekStart || new Date().toISOString(),
          weekEnd: weekEnd || new Date().toISOString(),
          days: days.map(day => ({
            ...day,
            // Filter out empty masses and intentions
            masses: day.masses
              .filter(mass => mass.time.trim())
              .map(mass => ({
                ...mass,
                intentions: mass.intentions.filter(intention => intention.intention.trim())
              }))
              .filter(mass => mass.intentions.length > 0)
          })).filter(day => day.masses.length > 0),
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
            intentionData.imageUrl = imageData.imageUrl;
          } else {
            const errorData = await imageUploadResponse.json();
            throw new Error(errorData.error || "Nie udało się przesłać zdjęcia");
          }
        }
        
        // Now update the intention with JSON data
        const fetchResponse = await fetch(`/mojaParafia/api/intentions/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(intentionData)
        });
        
        if (fetchResponse.ok) {
          alerts.showSuccess("Intencje na tydzień zaktualizowane pomyślnie!");
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            router.push("/admin/dashboard/intencje");
          }, 2000);
        } else {
          try {
            const errorData = await fetchResponse.json();
            console.error("Błąd podczas aktualizacji intencji", errorData);
            alerts.showError(errorData.error || "Wystąpił błąd podczas aktualizacji intencji. Spróbuj ponownie.");
          } catch {
            const errorText = await fetchResponse.text();
            console.error("Błąd podczas aktualizacji intencji", errorText);
            alerts.showError("Wystąpił błąd podczas aktualizacji intencji. Spróbuj ponownie.");
          }
        }
      } else {
        // For create mode, continue using FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("weekStart", weekStart || new Date().toISOString());
        formData.append("weekEnd", weekEnd || new Date().toISOString());
        if (image) formData.append("image", image);
        
        // Filter out empty masses and intentions
        const filteredDays = days.map(day => ({
          ...day,
          masses: day.masses
            .filter(mass => mass.time.trim())
            .map(mass => ({
              ...mass,
              intentions: mass.intentions.filter(intention => intention.intention.trim())
            }))
            .filter(mass => mass.intentions.length > 0)
        })).filter(day => day.masses.length > 0);
        
        formData.append("days", JSON.stringify(filteredDays));
        
        const axiosResponse = await axios.post("/mojaParafia/api/intentions", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (axiosResponse.status === 200 || axiosResponse.status === 201) {
          alerts.showSuccess("Intencje na tydzień dodane pomyślnie!");
          
          // Redirect after a short delay to show the success message
          setTimeout(() => {
            router.push("/admin/dashboard/intencje");
          }, 2000);
        } else {
          console.error("Błąd podczas dodawania intencji", axiosResponse.statusText);
          alerts.showError("Wystąpił błąd podczas dodawania intencji. Spróbuj ponownie.");
        }
      }
    } catch (error) {
      console.error("Błąd podczas " + (isEditMode ? "aktualizacji" : "dodawania") + " intencji", error);
      alerts.showError(`Wystąpił błąd podczas ${isEditMode ? "aktualizacji" : "dodawania"} intencji. Spróbuj ponownie.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-12">

      <div className="space-y-8">
        <div className="space-y-8">
          <Input 
            label="Tytuł tygodnia" 
            name="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Data początkowa tygodnia" 
              type="date" 
              name="weekStart" 
              value={weekStart} 
              onChange={(e) => setWeekStart(e.target.value)} 
              required
            />
            <Input 
              label="Data końcowa tygodnia" 
              type="date" 
              name="weekEnd" 
              value={weekEnd} 
              onChange={(e) => setWeekEnd(e.target.value)} 
              required
            />
          </div>
        </div>

        <div className="space-y-8">
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
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {existingImage ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
            </label>
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
          <h3 className="text-lg font-medium text-gray-900">Intencje na tydzień</h3>
        </div>

        <div className="space-y-10">
          {days.map((day, dayIndex) => {
            // Format the day date for display
            const dayDate = new Date(day.date);
            const formattedDate = dayDate.toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });

            return (
              <div key={dayIndex} className="border border-neutral/10 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-neutral/10">
                  <h4 className="font-medium text-gray-900 capitalize">{formattedDate}</h4>
                </div>
                
                <div className="p-6 space-y-6">
                  {day.masses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Brak mszy na ten dzień</p>
                  ) : (
                    day.masses.map((mass, massIndex) => (
                      <div key={massIndex} className="bg-white border border-neutral/10 rounded-lg p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-1/3">
                            <Input
                              label="Godzina mszy"
                              name={`time-${dayIndex}-${massIndex}`}
                              value={mass.time}
                              onChange={(e) => {
                                const filteredValue = e.target.value.replace(/[^0-9:.]/g, "");
                                handleMassTimeChange(dayIndex, massIndex, filteredValue);
                              }}
                              required
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveMass(dayIndex, massIndex);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                            title="Usuń mszę"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-gray-700">Intencje</h5>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddIntention(dayIndex, massIndex);
                              }}
                              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Dodaj intencję
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {mass.intentions.map((intention, intentionIndex) => (
                              <div key={intentionIndex} className="flex items-start space-x-3">
                                <input
                                  type="text"
                                  value={intention.intention}
                                  onChange={(e) => handleIntentionChange(dayIndex, massIndex, intentionIndex, e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-neutral/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                  placeholder="Intencja"
                                  required
                                />
                                <button 
                                  type="button" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveIntention(dayIndex, massIndex, intentionIndex);
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2.5 hover:bg-gray-50 rounded-lg"
                                  title="Usuń intencję"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="flex justify-center pt-2">
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddMass(dayIndex);
                      }}
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors px-4 py-2 border border-dashed border-neutral/20 rounded-lg hover:border-primary/30"
                    >
                      <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Dodaj mszę na {new Date(day.date).toLocaleDateString('pl-PL', { weekday: 'long' })}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          type="submit" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? "Zaktualizuj intencje na tydzień" : "Dodaj intencje na tydzień"}
        </button>
      </div>
    </form>
  );
}
