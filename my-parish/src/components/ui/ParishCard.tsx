import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

interface ParishCardProps {
  title: string;
  subtitle?: string;
  content?: string;
  date: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function ParishCard({ title, subtitle, content, date, isExpanded = false, onToggle }: ParishCardProps) {
  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-neutral-200 flex flex-col transform transition-all duration-300 hover:shadow-lg hover:bg-white/90 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-primary mb-2 text-center transition-colors duration-300 group-hover:text-blue-600">
            {title}
          </h2>
          <p className="text-neutral text-sm text-center transition-colors duration-300">
            • {date} •
          </p>
        </div>
        {onToggle && (
          <div className="text-primary ml-4">
            {isExpanded ? (
              <AiOutlineUp className="h-5 w-5" />
            ) : (
              <AiOutlineDown className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-2 border-t border-gray-200">
          {subtitle && (
            <p className="text-primary/80 text-center font-semibold mb-2 transition-colors duration-300">
              {subtitle}
            </p>
          )}
          {content && (
            <p className="text-neutral-700 text-left transition-colors duration-300 whitespace-normal break-words overflow-wrap-anywhere">
              {content}
            </p>
          )}
        </div>
      )}
    </div>
  );
}