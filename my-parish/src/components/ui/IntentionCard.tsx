import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAlerts } from "@/components/ui/Alerts";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  liturgicalName?: string;
  headerColor?: string;
}

interface Intention {
  _id: string;
  title: string;
  date: string;
  weekStart?: string;
  weekEnd?: string;
  imageUrl?: string;
  masses: Mass[];
  days?: Day[];
}

interface IntentionCardProps {
  intention: Intention;
  onDelete?: (id: string) => void;
}

export default function IntentionCard({ intention, onDelete }: IntentionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const alerts = useAlerts();

  const handleDelete = () => {
    alerts.showConfirmation(
      `Czy na pewno chcesz usunąć intencję: "${intention.title}"?`,
      () => {
        if (intention._id) {
          onDelete?.(intention._id);
        } else {
          alerts.showError("Nie można usunąć intencji: brak identyfikatora");
        }
      }
    );
  };

  const handleEdit = () => {
    router.push(`/admin/dashboard/intencje/edycja/${intention._id}`);
  };

  // Format like: "1 września - Poniedziałek" (weekday with capital letter)
  const formatPolishDateWithWeekday = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayMonth = d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
    const weekday = d.toLocaleDateString('pl-PL', { weekday: 'long' });
    const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return `${dayMonth} - ${weekdayCapitalized}`;
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-3 sm:p-4 bg-white mt-3 sm:mt-4">
      <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h3 className="text-base sm:text-lg font-semibold break-words whitespace-normal flex-1">{intention.title}</h3>
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <AiOutlineEdit 
            size={18} 
            className="cursor-pointer text-blue-500 hover:text-blue-700" 
            onClick={handleEdit}
          />
          <AiOutlineDelete 
            size={18} 
            className="cursor-pointer text-red-500 hover:text-red-700" 
            onClick={handleDelete} 
          />
          <span 
            className="cursor-pointer" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <AiOutlineUp size={18} /> : <AiOutlineDown size={18} />}
          </span>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
        {intention.weekStart && intention.weekEnd ? (
          <>Tydzień: {new Date(intention.weekStart).toLocaleDateString()} - {new Date(intention.weekEnd).toLocaleDateString()}</>
        ) : (
          <>Data: {new Date(intention.date).toLocaleDateString()}</>
        )}
      </p>

      {isExpanded && (
        <div className="mt-3 sm:mt-4">
          {intention.imageUrl && (
            <div className="relative w-full h-40 sm:h-60 mt-2">
              <Image 
                src={intention.imageUrl} 
                alt="Intencja" 
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {intention.days && intention.days.length > 0 ? (
            // Display grouped by days
            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {intention.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-t pt-2 sm:pt-3">
                  <h4
                    className="font-medium mb-1 sm:mb-2 text-sm sm:text-base"
                    style={{ color: day.headerColor || '#111827' }}
                  >
                    {formatPolishDateWithWeekday(day.date)} - {day.liturgicalName || 'Dzień Powszedni'}
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-xs sm:text-sm">
                    {day.masses.map((mass, massIndex) => (
                      <li key={massIndex}>
                        <strong>{mass.time}</strong>
                        {mass.intentions && mass.intentions.length > 0 ? (
                          <div className="ml-3 sm:ml-4">
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
          ) : (
            // Fallback to flat list for backward compatibility
            <ul className="list-disc list-inside mt-2 text-gray-700 text-xs sm:text-sm">
              {intention.masses.map((mass, index) => (
                <li key={index}>
                  <strong>{mass.time}</strong>
                  {mass.intention && <> – {mass.intention}</>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Zwinięta karta pokazuje tylko tytuł i datę - bez intencji */}
    </div>
  );
}
