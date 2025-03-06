import SectionTitle from "@/components/layout/SectionTitle";
import NewsForm from "@/containers/NewsForm";

export default function AddNews() {
  return (
    <div>
      <SectionTitle name="Dodaj aktualności" />
      <NewsForm />
    </div>
  );
}
