import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { useAlerts } from "@/components/ui/Alerts";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface News {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  date: string;
}

interface NewsCardProps {
  news: News;
  onDelete?: (id: string) => void;
}

export default function NewsCard({ news, onDelete }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const alerts = useAlerts();

  const handleDelete = async () => {
    alerts.showConfirmation(
      `Czy na pewno chcesz usunąć aktualność: "${news.title}"?`,
      async () => {
        if (!news._id) {
          alerts.showError("Nie można usunąć aktualności: brak identyfikatora");
          return;
        }
        
        try {
          const response = await axios.delete(`/mojaParafia/api/news/${news._id}`);
          console.log("Delete response:", response.data);
          onDelete?.(news._id);
          alerts.showSuccess("Aktualność została usunięta pomyślnie.");
        } catch (error) {
          console.error("Błąd podczas usuwania aktualności:", error);
          
          if (axios.isAxiosError(error) && error.response?.data?.error) {
            alerts.showError(`Nie udało się usunąć aktualności: ${error.response.data.error}`);
          } else {
            alerts.showError("Wystąpił błąd podczas usuwania aktualności. Spróbuj ponownie.");
          }
        }
      }
    );
  };

  const handleEdit = () => {
    router.push(`/admin/dashboard/aktualnosci/edycja/${news._id}`);
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-4 bg-white mt-4">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-semibold break-words whitespace-normal flex-1">{news.title}</h3>
        <div className="flex items-center space-x-3 shrink-0">
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
          <p className="text-sm text-gray-600">Data: {new Date(news.date).toLocaleDateString()}</p>
          
          {news.imageUrl && (
            <div className="relative h-60 mt-2">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <h4 className="text-md font-semibold mt-2 break-words whitespace-normal">{news.subtitle}</h4>

          <p className="mt-2 text-gray-700 break-words whitespace-normal">{news.content}</p>
        </div>
      )}
    </div>
  );
}
