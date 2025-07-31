interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className="w-full sm:container sm:mx-auto px-0 sm:px-4 py-4 sm:py-6">
      <div className={`w-full max-w-7xl mx-auto bg-gradient-to-br from-amber-50/50 to-stone-50/50 backdrop-blur-sm rounded-none sm:rounded-xl shadow-lg p-1 sm:p-6 border border-amber-100/20 ${className || ''}`}>
        {children}
      </div>
    </div>
  );
}
