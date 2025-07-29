import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";
import Image from "next/image";

const galleryImages = [
  {
    src: "/mojaParafia/KaplicaSwJana.jpg",
    alt: "Kaplica Św. Jana",
    width: 800,
    height: 600,
  },
  {
    src: "/mojaParafia/witraz_logo.jpg",
    alt: "Witraż Logo",
    width: 800,
    height: 600,
  },
  {
    src: "/mojaParafia/witraz.jpg",
    alt: "Witraż",
    width: 800,
    height: 600,
  },
  {
    src: "/mojaParafia/witraz2.jpg",
    alt: "Witraż 2",
    width: 800,
    height: 600,
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SectionTitle name="Galeria" className="mt-8"/>
      <PageContainer>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="group relative h-64 sm:h-80 overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-semibold">{image.alt}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
