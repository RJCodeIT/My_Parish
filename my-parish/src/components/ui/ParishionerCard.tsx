import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAlerts } from "./Alerts";

interface Sacrament {
  type: string;
  date: string;
}

interface Parishioner {
  _id: string;
  id?: string; // Added to support Prisma's default id field
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  phoneNumber?: string;
  email?: string;
  notes?: string;
  sacraments: Sacrament[];
}

const sacramentTranslations: Record<string, string> = {
  baptism: "Chrzest",
  firstCommunion: "Pierwsza Komunia",
  confirmation: "Bierzmowanie",
  marriage: "Małżeństwo",
  holyOrders: "Święcenia Kapłańskie",
  anointingOfTheSick: "Namaszczenie Chorych",
};

export default function ParishionerCard({ parishioner, onDelete }: { parishioner: Parishioner; onDelete: (id: string) => void }) {
  const [groups, setGroups] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const alerts = useAlerts();
  const router = useRouter();

  useEffect(() => {
    axios.get(`/mojaParafia/api/groups?memberId=${parishioner._id}`).then((res) => {
      setGroups(res.data.map((group: { name: string }) => group.name));
    });
  }, [parishioner._id]);

  const handleDelete = () => {
    alerts.showConfirmation(
      `Czy na pewno chcesz usunąć parafianina ${parishioner.firstName} ${parishioner.lastName}?`,
      () => onDelete(parishioner._id)
    );
  };

  const handleEdit = () => {
    // Use the id field directly from the API response
    const parishionerId = parishioner.id || parishioner._id;
    console.log("Editing parishioner with ID:", parishionerId);
    router.push(`/admin/dashboard/parafianie/edycja/${parishionerId}`);
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-3 sm:p-4 bg-white">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {parishioner.firstName} {parishioner.lastName}
          </h3>
          {/* Numer telefonu widoczny tylko na większych ekranach */}
          <p className="hidden sm:block text-sm text-gray-600">{parishioner.phoneNumber || "Brak telefonu"}</p>
        </div>
        <div className="flex items-center space-x-3">
          <AiOutlineEdit 
            size={20} 
            className="cursor-pointer text-blue-500 hover:text-blue-700" 
            onClick={handleEdit}
          />
          <AiOutlineDelete size={20} className="cursor-pointer text-red-500 hover:text-red-700" onClick={handleDelete} />
          <span className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <AiOutlineUp size={20} /> : <AiOutlineDown size={20} />}
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3 sm:mt-4">
          {/* Numer telefonu widoczny tylko na mobilnych urządzeniach */}
          <p className="block sm:hidden text-xs text-gray-600 font-medium">
            Telefon: {parishioner.phoneNumber || "Brak telefonu"}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
            Data urodzenia: {new Date(parishioner.dateOfBirth).toLocaleDateString()}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
            Adres: {parishioner.address.street} {parishioner.address.houseNumber}, {parishioner.address.postalCode} {parishioner.address.city}
          </p>
          {parishioner.email && <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">Email: {parishioner.email}</p>}
          {parishioner.notes && <p className="text-xs sm:text-sm text-gray-600 mt-1">Notatki: {parishioner.notes}</p>}
          <div className="mt-3 sm:mt-4">
            <h4 className="text-base sm:text-lg font-semibold">Sakramenty:</h4>
            {parishioner.sacraments.length > 0 ? (
              <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 mt-1">
                {parishioner.sacraments.map((sacrament, index) => (
                  <li key={index}>
                    {sacramentTranslations[sacrament.type] || sacrament.type} – {new Date(sacrament.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Brak sakramentów</p>
            )}
          </div>
          <div className="mt-3 sm:mt-4">
            <h4 className="text-base sm:text-lg font-semibold">Grupy parafialne:</h4>
            {groups.length > 0 ? (
              <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 mt-1">
                {groups.map((group, index) => (
                  <li key={index}>{group}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Nie należy do żadnej grupy</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}