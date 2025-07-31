import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";
import ChapelsGrid from "@/components/ui/ChapelsGrid";

export default function Chapels() {
  return (
    <div>
      <SectionTitle name="Kapliczki i inne" className="mt-8"/>
      <PageContainer>
        <div className="space-y-8 mb-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">
              Kapliczki i krzyże przydrożne
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Na terenie naszej parafii znajduje się wiele zabytkowych kapliczek i krzyży przydrożnych, 
              które są świadectwem wiary i historii naszej społeczności.
            </p>
          </div>
          <ChapelsGrid />
        </div>
      </PageContainer>
    </div>
  );
}
