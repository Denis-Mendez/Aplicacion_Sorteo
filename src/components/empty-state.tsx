import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
      <div className="mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
}
