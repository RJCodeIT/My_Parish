import Image from "next/image";

const churchPhotos = [
  {
    src: "/witraz.jpg",
    alt: "Witraż kościoła",
    aspectRatio: "3/4",
  },
  {
    src: "/kosciol-front.jpg",
    alt: "Fasada kościoła",
    aspectRatio: "4/3",
  },
  {
    src: "/kosciol-inside.jpg",
    alt: "Wnętrze kościoła",
    aspectRatio: "16/9",
  },
  {
    src: "/oltarz.jpg",
    alt: "Ołtarz główny",
    aspectRatio: "3/4",
  },
];

export default function ChurchPhotosGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {churchPhotos.map((photo) => (
        <div
          key={photo.src}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-neutral/30"
        >
          <div className="relative w-full aspect-[3/2] mx-auto">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <p className="text-center mt-4 text-neutral-600 font-medium">
            {photo.alt}
          </p>
        </div>
      ))}
    </div>
  );
}
