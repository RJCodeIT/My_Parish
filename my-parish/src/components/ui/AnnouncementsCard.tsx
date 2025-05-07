import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
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

  const handleDelete = async () => {
    if (window.confirm(`Czy na pewno chcesz usunąć ogłoszenie: "${announcement.title}"?`)) {
      try {
        // Use the id field which is what Prisma expects
        const idToUse = announcement.id || announcement._id;
        console.log('Deleting announcement with ID:', idToUse);
        
        await axios.delete(`/api/announcements/${idToUse}`);
        // Make sure we have a valid ID to pass to onDelete
        if (announcement._id) {
          onDelete?.(announcement._id);
        }
      } catch (error) {
        console.error("Błąd podczas usuwania ogłoszenia:", error);
        alert("Wystąpił błąd podczas usuwania ogłoszenia");
      }
    }
  };

  const handleEdit = () => {
    router.push(`/admin/dashboard/ogloszenia/edycja/${announcement._id}`);
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-4 bg-white mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{announcement.title}</h3>
        <div className="flex items-center space-x-3">
          <AiOutlineEdit 
            size={20} 
            className="cursor-pointer text-blue-500 hover:text-blue-700" 
            onClick={handleEdit}
          />
          <AiOutlineDelete 
            size={20} 
            className="cursor-pointer text-red-500 hover:text-red-700" 
            onClick={handleDelete} 
          />
          <span 
            className="cursor-pointer" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <AiOutlineUp size={20} /> : <AiOutlineDown size={20} />}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Data: {new Date(announcement.date).toLocaleDateString()}</p>
          
          {announcement.imageUrl && (
            <div className="relative w-full h-60 mt-2">
              <Image
                src={announcement.imageUrl}
                alt="Zdjęcie ogłoszenia"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          <ul className="list-disc list-inside mt-2 text-gray-700">
            {announcement.content.map((item) => (
              <li key={item.order}>{item.text}</li>
            ))}
          </ul>

          {announcement.extraInfo && (
            <p className="mt-2 text-sm text-gray-700">{announcement.extraInfo}</p>
          )}
        </div>
      )}
    </div>
  );
}
