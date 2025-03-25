interface ParishCardProps {
  title: string;
  subtitle?: string;
  date: string;
}

export default function ParishCard({ title, subtitle, date }: ParishCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-neutral-200 h-full flex flex-col transform transition-all duration-300 hover:shadow-lg hover:bg-white/90 hover:-translate-y-1 cursor-pointer">
      <h2 className="text-xl font-bold text-primary mb-2 text-center transition-colors duration-300 group-hover:text-blue-600">
        {title}
      </h2>
      <p className="text-neutral text-sm text-center mb-4 transition-colors duration-300">
        • {date} •
      </p>
      {subtitle && (
        <p className="text-primary/80 text-center transition-colors duration-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}