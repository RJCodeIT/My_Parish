import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAlerts } from "@/components/ui/Alerts";
import { useRouter } from "next/navigation";

interface Announcement {
  _id: string;
  id?: string; // Add id field for Prisma compatibility
  title: string;
  date: string;
  imageUrl?: string;
  content: { order: number; text: string }[];
  extraInfo?: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onDelete?: (id: string) => void;
}

export default function AnnouncementCard({ announcement, onDelete }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const alerts = useAlerts();

  const handleDelete = () => {
    alerts.showConfirmation(
      `Czy na pewno chcesz usunąć ogłoszenie: "${announcement.title}"?`,
      () => {
        const idToUse = announcement.id || announcement._id;
        if (idToUse) {
          onDelete?.(idToUse);
        } else {
          alerts.showError("Nie można usunąć ogłoszenia: brak identyfikatora");
        }
      }
    );
  };

  const handleEdit = () => {
    router.push(`/admin/dashboard/ogloszenia/edycja/${announcement._id}`);
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-3 sm:p-4 bg-white mt-3 sm:mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-semibold">{announcement.title}</h3>
        <div className="flex items-center space-x-2 sm:space-x-3">
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
      <p className="text-xs text-gray-500 mt-1">{new Date(announcement.date).toLocaleDateString()}</p>

      {isExpanded && (
        <div className="mt-3 sm:mt-4">
          {announcement.imageUrl && (
            <div className="relative w-full h-40 sm:h-60 mt-2">
              <Image
                src={announcement.imageUrl}
                alt="Zdjęcie ogłoszenia"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          <div className="mt-3">
            <h4 className="text-sm font-semibold mb-1">Treść:</h4>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 space-y-1">
              {announcement.content.map((item) => (
                <li key={item.order}>{item.text}</li>
              ))}
            </ul>
          </div>

          {announcement.extraInfo && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-1">Dodatkowe informacje:</h4>
              <p className="text-xs sm:text-sm text-gray-700">{announcement.extraInfo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
