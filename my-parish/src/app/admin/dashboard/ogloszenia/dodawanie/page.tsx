import SectionTitle from "@/components/layout/SectionTitle";
import AnnouncementsForm from "@/containers/AnnouncementsForm";

export default function AddAnnouncement() {
  return (
    <div>
      <SectionTitle name="Dodaj ogłoszenie" />
      <AnnouncementsForm />
    </div>
  );
}
