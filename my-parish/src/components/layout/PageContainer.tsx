interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-amber-50/50 to-stone-50/50 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-amber-100/20">
        {children}
      </div>
    </div>
  );
}
