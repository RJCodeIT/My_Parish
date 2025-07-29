"use client"
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAlerts } from "@/components/ui/Alerts";
import { isMonday, isSunday, getNextMonday, getSundayFromMonday, validateWeekRange, generateWeekDates, getPolishDayName, formatDateToPolish } from "@/utils/dateUtils";

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
  const [days, setDays] = useState<Day[]>([]);
  const router = useRouter();
  const alerts = useAlerts();

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      
      // Konwertuj daty z formatu ISO do formatu YYYY-MM-DD wymaganego przez input type="date"
      if (initialData.weekStart) {
        // Wyciągnij datę w formacie YYYY-MM-DD z ISO string
        const formattedStartDate = initialData.weekStart.split('T')[0];
        console.log('Ustawiam datę początkową:', formattedStartDate);
        setWeekStart(formattedStartDate);
        
        // Wygeneruj pełny tydzień jak przy dodawaniu nowych intencji
        const weekDates = generateWeekDates(formattedStartDate);
        
        // Utwórz pusty szkielet dla wszystkich 7 dni tygodnia
        const emptyWeek: Day[] = weekDates.map(date => ({
          date,
          masses: []
        }));
        
        // Jeśli mamy dane dla niektórych dni, uzupełnij nimi pusty szkielet
        if (initialData.days && initialData.days.length > 0) {
          // Dla każdego dnia w pustym tygodniu
          for (let i = 0; i < emptyWeek.length; i++) {
            // Znajdź odpowiadający dzień w danych (jeśli istnieje)
            const matchingDay = initialData.days.find(day => day.date.split('T')[0] === emptyWeek[i].date);
            
            // Jeśli znaleziono pasujący dzień, użyj jego danych
            if (matchingDay) {
              emptyWeek[i].masses = matchingDay.masses;
              if (matchingDay.id) emptyWeek[i].id = matchingDay.id;
            }
          }
        }
        
        setDays(emptyWeek);
      }
      
      if (initialData.weekEnd) {
        // Wyciągnij datę w formacie YYYY-MM-DD z ISO string
        const formattedEndDate = initialData.weekEnd.split('T')[0];
        console.log('Ustawiam datę końcową:', formattedEndDate);
        setWeekEnd(formattedEndDate);
      }
    }
  }, [isEditMode, initialData]);
  
  // Initialize empty week when weekStart changes
  useEffect(() => {
    if (weekStart && !isEditMode) {
      // Only generate empty week if the start date is a Monday
      if (isMonday(weekStart)) {
        generateEmptyWeek(weekStart);
      }
    } else if (!weekStart) {
      // Clear days when start date is cleared
      setDays([]);
    }
  }, [weekStart, isEditMode]);
  
  // Generate an empty week structure based on the start date (which must be a Monday)
  const generateEmptyWeek = (startDateStr: string) => {
    if (!isMonday(startDateStr)) {
      alerts.showError("Data początkowa musi być poniedziałkiem");
      return;
    }
    
    // Calculate the end date (Sunday) based on the start date (Monday)
    const endDate = getSundayFromMonday(startDateStr);
    setWeekEnd(endDate);
    
    // Generate all 7 days of the week
    const weekDates = generateWeekDates(startDateStr);
    
    const newDays: Day[] = weekDates.map(date => ({
      date,
      masses: []
    }));
    
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
    
    // Validate date range (must be Monday to Sunday, exactly 7 days)
    const validation = validateWeekRange(weekStart, weekEnd);
    if (!validation.isValid) {
      alerts.showError(validation.message || "Nieprawidłowy zakres dat");
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
    
    // Filter out empty masses and intentions for all operations
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

    try {
      if (isEditMode && initialData?._id) {
        // Prepare the intention data as JSON for update
        const intentionData = {
          title,
          weekStart: weekStart || new Date().toISOString(),
          weekEnd: weekEnd || new Date().toISOString(),
          days: filteredDays
        };
        
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
        // Logowanie danych formularza dla diagnostyki
        console.log("Dane formularza:", {
          title,
          weekStart,
          weekEnd,
          days: filteredDays
        });
        
        // Sprawdź, czy filteredDays zawiera dane
        if (filteredDays.length === 0) {
          alerts.showError("Brak dni z mszami i intencjami do zapisania. Dodaj przynajmniej jedną mszę z intencją.");
          return;
        }
        
        // Use FormData to handle potential image upload
        const formData = new FormData();
        formData.append("title", title);
        formData.append("weekStart", weekStart || new Date().toISOString());
        formData.append("weekEnd", weekEnd || new Date().toISOString());
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
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-3 sm:px-6 w-full">

      <div className="space-y-8">
        <div className="space-y-8">
          <Input 
            label="Tytuł tygodnia" 
            name="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Input 
                label="Data początkowa tygodnia (poniedziałek)" 
                type="date" 
                name="weekStart" 
                value={weekStart} 
                onChange={(e) => {
                  const newDate = e.target.value;
                  if (newDate && !isMonday(newDate)) {
                    alerts.showError("Data początkowa musi być poniedziałkiem");
                    // Find the next Monday from the selected date
                    const nextMondayDate = getNextMonday(new Date(newDate));
                    setWeekStart(nextMondayDate);
                    // Automatically set the end date to the Sunday of the same week
                    if (nextMondayDate) {
                      setWeekEnd(getSundayFromMonday(nextMondayDate));
                    }
                  } else {
                    setWeekStart(newDate);
                    // Automatically set the end date to the Sunday of the same week
                    if (newDate) {
                      setWeekEnd(getSundayFromMonday(newDate));
                    }
                  }
                }} 
                required
              />
              <p className="text-xs text-gray-500 mt-1">Data końcowa to zawsze niedziela po wybranym poniedziałku</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">

        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-neutral/10 pb-3 sm:pb-4">
          <h3 className="text-lg font-medium text-gray-900">Intencje na tydzień</h3>
        </div>
        
        {days.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Wybierz datę początkową (poniedziałek), aby zobaczyć dni tygodnia</p>
          </div>
        )}

        {days.length > 0 && (
          <div className="space-y-6 sm:space-y-10">
            {days.map((day, dayIndex) => {
              // Format the day date for display using our utility functions
              const polishDayName = getPolishDayName(day.date);
              const formattedDate = formatDateToPolish(day.date);

              return (
                <div key={dayIndex} className="border border-neutral/10 rounded-lg sm:rounded-xl overflow-hidden max-w-full">
                  <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral/10">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{polishDayName}, {formattedDate}</h4>
                  </div>
                
                  <div className="px-3 py-3 sm:p-6 space-y-3 sm:space-y-6 overflow-x-hidden">
                    {day.masses.length === 0 ? (
                      <p className="text-gray-500 text-center py-3 sm:py-4 text-sm sm:text-base">Brak mszy na ten dzień</p>
                    ) : (
                      day.masses.map((mass, massIndex) => (
                        <div key={massIndex} className="bg-white border border-neutral/10 rounded-lg px-3 py-3 sm:p-5 space-y-2 sm:space-y-4 max-w-full">
                          <div className="grid grid-cols-[2fr,auto] gap-1 items-end max-w-full mb-2">
                            <div className="max-w-full">
                              <label className="text-xs font-medium mb-1 block">Godzina mszy<span className="text-red-500 ml-1">*</span></label>
                              <input
                                type="text"
                                name={`time-${dayIndex}-${massIndex}`}
                                value={mass.time}
                                onChange={(e) => {
                                  const filteredValue = e.target.value.replace(/[^0-9:.]/g, "");
                                  handleMassTimeChange(dayIndex, massIndex, filteredValue);
                                }}
                                className="w-full px-1.5 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-neutral/10 rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary"
                                required
                              />
                            </div>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveMass(dayIndex, massIndex);
                              }}
                              className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-50 rounded-lg"
                              title="Usuń mszę"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xs sm:text-sm font-medium text-gray-700">Intencje</h5>
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddIntention(dayIndex, massIndex);
                                }}
                                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Dodaj intencję
                              </button>
                            </div>
                            
                            <div className="space-y-2 sm:space-y-3">
                              <p className="text-xs font-medium mb-1">Intencje:</p>
                              {mass.intentions.map((intention, intentionIndex) => (
                                <div key={intentionIndex} className="grid grid-cols-[1fr,auto] gap-1 max-w-full">
                                  <input
                                    type="text"
                                    value={intention.intention}
                                    onChange={(e) => handleIntentionChange(dayIndex, massIndex, intentionIndex, e.target.value)}
                                    className="w-full px-1.5 sm:px-3 py-1 sm:py-2 text-xs sm:text-base border border-neutral/10 rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary"
                                    placeholder="Intencja"
                                    required
                                  />
                                  <button 
                                    type="button" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemoveIntention(dayIndex, massIndex, intentionIndex);
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-50 rounded-lg"
                                    title="Usuń intencję"
                                  >
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    
                    <div className="flex justify-center pt-1 sm:pt-2">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddMass(dayIndex);
                        }}
                        className="inline-flex items-center text-xs sm:text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 sm:px-4 py-1.5 sm:py-2 border border-dashed border-neutral/20 rounded-lg hover:border-primary/30"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Dodaj mszę na {getPolishDayName(day.date)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center sm:justify-end pt-6 sm:pt-8">
        <button 
          type="submit" 
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isEditMode ? "Zaktualizuj intencje na tydzień" : "Dodaj intencje na tydzień"}
        </button>
      </div>
    </form>
  );
}
