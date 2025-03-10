
import { Suspense } from 'react';

// Loading state for the Suspense fallback
const LoadingState = () => (
  <div className="w-full max-w-6xl mx-auto px-4 py-10 flex flex-col items-center">
    <div className="w-full text-center mb-8">
      <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-4"></div>
      <div className="h-4 w-96 bg-muted rounded animate-pulse mx-auto"></div>
    </div>
    
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
      </div>
      <div className="space-y-8">
        <div className="h-24 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-48 bg-muted rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Suspense fallback={<LoadingState />}>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to SpeechFlow</h1>
          <p className="mt-4 text-muted-foreground">
            Navigate to any page using the links above
          </p>
        </div>
      </Suspense>
    </div>
  );
};

export default Index;
