interface ParishCardProps {
  title: string;
  subtitle?: string;
  date: string;
}

export default function ParishCard({ title, subtitle, date }: ParishCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-gray-200 h-full flex flex-col">
      <h2 className="text-xl font-bold text-primary mb-2 text-center">
        {title}
      </h2>
      <p className="text-gray-500 text-sm text-center mb-4">
        • {date} •
      </p>
      {subtitle && (
        <p className="text-gray-700 text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
}