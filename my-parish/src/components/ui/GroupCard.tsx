import React, { useState } from "react";
import { PopulatedGroup } from "@/types";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  group: PopulatedGroup;
  onDelete?: (id: string) => void;
}

export default function GroupCard({ group, onDelete }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm(`Czy na pewno chcesz usunąć grupę ${group.name}?`)) {
      try {
        await axios.delete(`/api/groups/${group._id}`);
        onDelete?.(group._id);
      } catch (error) {
        console.error("Błąd podczas usuwania grupy:", error);
        alert("Wystąpił błąd podczas usuwania grupy");
      }
    }
  };

  const handleEdit = () => {
    router.push(`/admin/dashboard/grupy-parafialne/edycja/${group._id}`);
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          {group.description && (
            <p className="text-sm text-gray-600">{group.description}</p>
          )}
        </div>
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
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Lider:</h4>
            {group.leaderId ? (
              <p className="text-sm text-gray-700">
                {group.leaderId.firstName} {group.leaderId.lastName}
              </p>
            ) : (
              <p className="text-sm text-gray-500">Brak danych</p>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Członkowie:</h4>
            {group.members && group.members.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {group.members.map((member) => (
                  <li key={member._id}>
                    {member.firstName} {member.lastName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Brak członków</p>
            )}
          </div>

          {group.meetingSchedule && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Harmonogram spotkań:</h4>
              <p className="text-sm text-gray-700">{group.meetingSchedule}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
