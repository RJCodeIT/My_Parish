import SectionTitle from "@/components/layout/SectionTitle";
import GroupsForm from "@/containers/GroupsForm";

export default function page() {
  return (
    <div>
      <SectionTitle name="Dodawanie grupy parafialnej" />
      <GroupsForm />
    </div>
  );
}
