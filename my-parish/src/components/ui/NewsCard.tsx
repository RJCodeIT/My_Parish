import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import Image from "next/image";

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

  const handleDelete = async () => {
    if (window.confirm(`Czy na pewno chcesz usunąć aktualność: "${news.title}"?`)) {
      try {
        await axios.delete(`/api/news/${news._id}`);
        onDelete?.(news._id);
      } catch (error) {
        console.error("Błąd podczas usuwania aktualności:", error);
        alert("Wystąpił błąd podczas usuwania aktualności");
      }
    }
  };

  return (
    <div className="w-full border rounded-lg shadow-md p-4 bg-white mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{news.title}</h3>
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

          <h4 className="text-md font-semibold mt-2">{news.subtitle}</h4>

          <p className="mt-2 text-gray-700">{news.content}</p>
        </div>
      )}
    </div>
  );
}
