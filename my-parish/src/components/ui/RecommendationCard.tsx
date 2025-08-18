import Link from "next/link";

interface RecommendationCardProps {
  title: string;
  href: string;
}

export default function RecommendationCard({ title, href }: RecommendationCardProps) {
  return (
    <Link 
      href={href} 
      className="group flex items-center justify-center p-5 bg-white/80 rounded-xl shadow-md border border-primary/10 hover:shadow-lg hover:bg-white/95 transition-all h-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/5 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></div>
      <h3 className="font-semibold text-primary text-center relative z-10 group-hover:text-secondary transition-colors duration-300">{title}</h3>
    </Link>
  );
}
