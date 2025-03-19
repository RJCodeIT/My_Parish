import SectionTitle from "@/components/layout/SectionTitle";
import ParishionersForm from "@/containers/ParishionersForm";

export default function AddParishioner() {
  return (
    <div className="space-y-16">
      <SectionTitle name="Dodawanie parafianina" />
      <ParishionersForm />
    </div>
  )
}