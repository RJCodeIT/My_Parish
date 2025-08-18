import ContactHero from "@/components/ui/ContactHero";

export default function Contact() {
  return (
    <div className="overflow-x-hidden w-full flex flex-col min-h-screen">
      <ContactHero 
        imageUrl="/mojaParafia/KaplicaSwJana.jpg"
        altText="Kościół parafialny"
      />
    </div>
  );
}
