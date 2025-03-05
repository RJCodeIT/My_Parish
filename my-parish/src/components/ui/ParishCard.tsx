interface ParishCardProps {
  title: string;
  subtitle?: string;
  date: string;
}

export default function ParishCard({ title, subtitle, date }: ParishCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-neutral/30 h-full flex flex-col">
      <h2 className="text-xl font-bold text-primary mb-2 text-center">
        {title}
      </h2>
      <p className="text-neutral text-sm text-center mb-4">
        • {date} •
      </p>
      {subtitle && (
        <p className="text-primary/80 text-center">
          {subtitle}
        </p>
      )}
    </div>
  );
}