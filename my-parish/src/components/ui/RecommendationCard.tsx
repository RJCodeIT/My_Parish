import Link from "next/link";

interface RecommendationCardProps {
  title: string;
  href: string;
}

export default function RecommendationCard({ title, href }: RecommendationCardProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-neutral/20 hover:shadow-md hover:border-secondary/50 transition-all h-24"
    >
      <h3 className="font-semibold text-primary text-center">{title}</h3>
    </Link>
  );
}
