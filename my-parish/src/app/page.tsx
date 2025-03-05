import HomeHighlight from "@/containers/HomeHighlight";
import NewsContainer from "@/containers/NewsContainer";

export default function Home() {
  return (
    <div>
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-4xl font-bold text-primary text-center mb-2 relative">
          <span className="relative">
            Aktualności
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></span>
          </span>
        </h1>
      </div>
      <HomeHighlight />
      <NewsContainer />
    </div>
  );
}