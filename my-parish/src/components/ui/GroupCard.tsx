import React, { useState } from "react";
import { PopulatedGroup } from "@/types";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import { useRouter } from "next/navigation";

interface GroupMember {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
}

interface GroupCardProps {
  group: PopulatedGroup & { members: GroupMember[] };
  onDelete?: (id: string) => void;
}

export default function GroupCard({ group, onDelete }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Helper function to get the group ID (handles both _id and id formats)
  const getGroupId = (): string => {
    return (group._id || group.id || "") as string;
  };

  const handleDelete = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć grupę ${group.name}?`)) {
      onDelete?.(getGroupId());
    }
  };

  const handleEdit = () => {
    const groupId = getGroupId();
    console.log("Editing group with ID:", groupId);
    router.push(`/admin/dashboard/grupy-parafialne/edycja/${groupId}`);
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
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">Lider:</h4>
              {group.leaderId && typeof group.leaderId === 'object' && 'firstName' in group.leaderId && 'lastName' in group.leaderId ? (
                <span className="text-gray-700">
                  {group.leaderId.firstName} {group.leaderId.lastName}
                </span>
              ) : (
                <span className="text-gray-500">Brak danych</span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Członkowie:</h4>
            {group.members && group.members.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {group.members.map((member: GroupMember, index: number) => {
                  // The API returns members as array of { _id, id, firstName, lastName }
                  if (member && (member.firstName || member.lastName)) {
                    return (
                      <li key={member._id || member.id || index}>
                        {member.firstName} {member.lastName}
                      </li>
                    );
                  }
                  return null;
                }).filter(Boolean)}
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
