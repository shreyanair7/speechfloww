
import { useState, useEffect } from 'react';
import SpeechAnalyzer from '@/components/SpeechAnalyzer';

const Analyzer = () => {
  return (
    <div className="py-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Speech Analyzer</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Record your speech and get instant analysis of filler words and speaking clarity
        </p>
      </div>
      
      <SpeechAnalyzer />
    </div>
  );
};

export default Analyzer;
