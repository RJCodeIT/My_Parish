"use client"
import React, { useEffect, useState } from "react";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import PageContainer from "@/components/layout/PageContainer";
import Pagination from "@/components/ui/Pagination";
import SearchForm from "@/components/ui/SearchForm";
import Image from "next/image";
import Hero from "@/components/ui/Hero";

interface MassIntention {
  id?: string;
  intention: string;
}

interface Mass {
  id?: string;
  time: string;
  intention?: string; // Legacy support
  intentions?: MassIntention[]; // New schema
}

interface Day {
  date: string;
  masses: Mass[];
}

interface Intention {
  id?: string;
  _id?: string;
  title: string;
  date: string;
  weekStart?: string;
  weekEnd?: string;
  imageUrl?: string;
  masses?: Mass[];
  days?: Day[];
  // Dla wstecznej kompatybilności
  intentionTime?: string;
  description?: string;
};

// Format date for display (DD-MM-YYYY)
function formatDate(dateString: string) {
  try {
    if (!dateString || dateString === "Invalid Date") {
      return "Data nieokreślona";
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "Data nieokreślona";
  }
}

// Format day name (e.g., "Poniedziałek, 3 czerwca 2025")
function formatDayName(dateString: string) {
  try {
    if (!dateString) return "Data nieokreślona";
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString('pl-PL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting day name:", error);
    return dateString;
  }
}

// Komponent karty intencji mszalnej
function IntentionCardPublic({ intention, isExpanded, onToggle }: { 
  intention: Intention, 
  isExpanded: boolean, 
  onToggle: () => void 
}) {
  return (
    <div className="w-full border rounded-lg shadow-md p-4 bg-white mt-4">
      <div onClick={onToggle} style={{ cursor: 'pointer' }}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex-grow"></div>
          <h3 className="text-lg font-semibold text-center flex-grow">{intention.title}</h3>
          <div className="flex items-center flex-grow justify-end">
            <span>{isExpanded ? <AiOutlineUp size={20} /> : <AiOutlineDown size={20} />}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-2 text-center">
        {intention.weekStart && intention.weekEnd ? (
          <>Tydzień: {formatDate(intention.weekStart)} - {formatDate(intention.weekEnd)}</>
        ) : (
          <>Data: {formatDate(intention.date)}</>
        )}
      </p>

      {isExpanded && (
        <div className="mt-4">
          {intention.imageUrl && (
            <div className="relative w-full h-60 mt-2">
              <Image 
                src={intention.imageUrl} 
                alt="Intencja" 
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {intention.days && intention.days.length > 0 ? (
            // Wyświetl pogrupowane według dni
            <div className="mt-4 space-y-4">
              {intention.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-t pt-3">
                  <h4 className="font-medium text-gray-800 mb-2 text-center">
                    {formatDayName(day.date)}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {day.masses.map((mass, massIndex) => (
                      <li key={massIndex}>
                        <strong>{mass.time}</strong>
                        {mass.intentions && mass.intentions.length > 0 ? (
                          <div className="ml-4">
                            {mass.intentions.map((intention, idx) => (
                              <div key={idx}>– {intention.intention}</div>
                            ))}
                          </div>
                        ) : mass.intention ? (
                          <> – {mass.intention}</>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : intention.masses && intention.masses.length > 0 ? (
            // Wyświetl płaską listę dla wstecznej kompatybilności
            <ul className="list-disc list-inside mt-2 text-gray-700">
              {intention.masses.map((mass, index) => (
                <li key={index}>
                  <strong>{mass.time}</strong>
                  {mass.intention && <> – {mass.intention}</>}
                </li>
              ))}
            </ul>
          ) : intention.description ? (
            // Fallback dla starego formatu
            <div className="mt-4 text-gray-700">
              {intention.intentionTime && <p className="font-bold mb-2 text-center">{intention.intentionTime}</p>}
              <p>{intention.description}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function Intentions() {
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIntentions, setExpandedIntentions] = useState<Set<string>>(new Set());
  const [useMock, setUseMock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchIntentions = async () => {
      try {
        setLoading(true);
        setError(null);
        setUseMock(false);
        
        console.log('Próba pobrania intencji z API...');
        const response = await fetch('/mojaParafia/api/intentions');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch intentions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Odpowiedź z API intencji:', data);
        
        // Ustaw dane z API, nawet jeśli są puste
        setIntentions(data);
      } catch (err) {
        console.error('Błąd podczas pobierania intencji:', err);
        setError('Błąd ładowania intencji. Spróbuj odświeżyć stronę.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntentions();
  }, []);

  const toggleIntention = (id: string) => {
    setExpandedIntentions((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter intentions based on search query
  const filteredIntentions = intentions.filter((intention) => {
    if (!searchQuery) return true;
    return intention.title.toLowerCase().includes(searchQuery);
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIntentions = filteredIntentions.slice(startIndex, endIndex);

  // Przenieślismy funkcje formatowania na poziom modułu

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Nieustannie się módlcie. W każdym położeniu dziękujcie, taka jest bowiem wola Boża w Jezusie Chrystusie względem was."
          source="1 List do Tesaloniczan 5:17-18"
          pageName="Intencje Mszalne"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <SearchForm 
          onSearch={handleSearch}
          placeholder="Szukaj w intencjach..."
        />
        {loading ? (
          <div className="text-center py-8">Ładowanie intencji...</div>
        ) : error && !useMock ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : intentions.length === 0 ? (
          <div className="text-center py-8">Brak intencji do wyświetlenia</div>
        ) : (
          <>
            {useMock && (
              <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-center">
                Wyświetlam przykładowe intencje (dane testowe)
              </div>
            )}
            
            {currentIntentions.map((intention) => {
              const intentionId = intention._id || intention.id || '';
              const isExpanded = expandedIntentions.has(intentionId);
              
              return (
                <IntentionCardPublic
                  key={intentionId}
                  intention={intention}
                  isExpanded={isExpanded}
                  onToggle={() => toggleIntention(intentionId)}
                />
              );
            })}
          </>
        )}
        
        {!loading && !error && filteredIntentions.length > 0 && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredIntentions.length}
            onPageChange={setCurrentPage}
          />
        )}
      </PageContainer>
    </div>
  );
}
