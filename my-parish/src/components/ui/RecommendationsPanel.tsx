import React from 'react';
import RecommendationCard from './RecommendationCard';
import recommendations from '@/const/recommendations';
import PageContainer from '@/components/layout/PageContainer';

interface RecommendationsPanelProps {
  className?: string;
}

export default function RecommendationsPanel({ className = '' }: RecommendationsPanelProps) {
  return (
    <PageContainer className={className}>
      <h2 className="text-xl font-bold text-primary mb-6 text-center">
        Polecane
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.link}
            title={recommendation.name}
            href={recommendation.link}
          />
        ))}
      </div>
    </PageContainer>
  );
}
