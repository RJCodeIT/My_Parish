import React from "react";

type SectionTitleProps = {
  name: string;
  className?: string;
};

export default function SectionTitle({ name, className }: SectionTitleProps) {
  return (
    <div className={`container mx-auto px-4 ${className || ''}`}>
      <h1 className="text-4xl font-bold text-primary text-center mb-2 relative">
        <span className="relative">
          {name}
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></span>
        </span>
      </h1>
    </div>
  );
}
