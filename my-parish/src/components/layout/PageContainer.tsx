interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <section className="w-full">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Subtle background glow and vignette */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-10 bottom-0 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(1200px_400px_at_50%_-50%,rgba(255,255,255,0.55),transparent)]" />
        </div>

        {/* Gradient frame + content card */}
        <div className="relative rounded-[28px] p-[1.5px] bg-gradient-to-br from-primary/20 via-amber-200/20 to-transparent">
          <div className="relative rounded-3xl md:rounded-[32px] border border-white/50 bg-white/75 backdrop-blur-2xl shadow-[0_22px_60px_-22px_rgba(0,0,0,0.34)] ring-1 ring-primary/5">
            {/* Hairline accents */}
            <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* Subtle texture pattern (ultra-light) */}
            <div className="pointer-events-none absolute inset-0 rounded-inherit opacity-[0.035] [background:radial-gradient(1px_1px_at_10px_10px,rgba(0,0,0,0.9)_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className={`p-6 sm:p-8 lg:p-10 ${className || ''}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
