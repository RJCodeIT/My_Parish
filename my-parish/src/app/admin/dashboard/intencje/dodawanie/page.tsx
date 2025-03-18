import SectionTitle from "@/components/layout/SectionTitle";
import IntentionsForm from "@/containers/IntentionsForm";

export default function AddIntention() {
  return (
    <div className="space-y-16">
      <SectionTitle name="Dodawanie Intencji" />
      <IntentionsForm />
    </div>
  );
}
