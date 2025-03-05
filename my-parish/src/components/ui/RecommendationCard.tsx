import Link from "next/link";

interface RecommendationCardProps {
  title: string;
  href: string;
}

export default function RecommendationCard({ title, href }: RecommendationCardProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-24"
    >
      <h3 className="font-semibold text-primary text-center">{title}</h3>
    </Link>
  );
}
