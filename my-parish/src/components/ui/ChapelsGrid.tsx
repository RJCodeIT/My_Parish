import Image from "next/image";

const chapelPhotos = [
  {
    src: "/mojaParafia/KaplicaSwJana.jpg",
    alt: "Kapliczka przy ulicy Sosnowej",
    description: "Zabytkowa kapliczka z XIX wieku, odnowiona w 2020 roku. Znajduje się przy skrzyżowaniu ulic...",
    aspectRatio: "3/4",
  },
  {
    src: "/mojaParafia/KaplicaSwJana.jpg",
    alt: "Kapliczka Matki Bożej",
    description: "Kapliczka Matki Bożej ufundowana przez rodzinę...",
    aspectRatio: "3/4",
  },
  {
    src: "/mojaParafia/KaplicaSwJana.jpg",
    alt: "Krzyż przydrożny",
    description: "Zabytkowy krzyż przydrożny postawiony w podziękowaniu za...",
    aspectRatio: "3/4",
  },
  {
    src: "/mojaParafia/KaplicaSwJana.jpg",
    alt: "Kapliczka św. Jana",
    description: "Kapliczka św. Jana z 1905 roku, charakterystyczna dla regionu...",
    aspectRatio: "3/4",
  },
];

export default function ChapelsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {chapelPhotos.map((photo) => (
        <div
          key={photo.src}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-neutral/30"
        >
          <div className="relative w-full aspect-[4/3] mx-auto">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <h3 className="text-lg font-semibold text-primary mt-4 text-center">
            {photo.alt}
          </h3>
          <p className="mt-2 text-neutral-600 text-center">
            {photo.description}
          </p>
        </div>
      ))}
    </div>
  );
}
