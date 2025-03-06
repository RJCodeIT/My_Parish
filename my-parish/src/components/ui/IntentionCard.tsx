import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import Image from "next/image";

interface Mass {
  time: string;
  intention: string;
}

interface Intention {
  _id: string;
  title: string;
  date: string;
  imageUrl?: string;
  masses: Mass[];
}

interface IntentionCardProps {
  intention: Intention;
  onDelete?: (id: string) => void;
}

export default function IntentionCard({ intention, onDelete }: IntentionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Czy na pewno chcesz usunąć intencję: "${intention.title}"?`)) {
      try {
        await axios.delete(`/api/intentions/${intention._id}`);
        onDelete?.(intention._id);
      } catch (error) {
        console.error("Błąd podczas usuwania intencji:", error);
        alert("Wystąpił błąd podczas usuwania intencji");
      }
    }
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-4 bg-white mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{intention.title}</h3>
        <div className="flex items-center space-x-3">
          <AiOutlineEdit 
            size={20} 
            className="cursor-pointer text-blue-500 hover:text-blue-700" 
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
          <p className="text-sm text-gray-600">Data: {new Date(intention.date).toLocaleDateString()}</p>
          
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

          <ul className="list-disc list-inside mt-2 text-gray-700">
            {intention.masses.map((mass, index) => (
              <li key={index}>
                <strong>{mass.time}</strong> – {mass.intention}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
