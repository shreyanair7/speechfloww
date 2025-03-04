
import { useState, useEffect, useRef } from 'react';
import FillerWordHighlighter from './FillerWordHighlighter';
import { formatPercentage } from '@/utils/analysisUtils';

interface TranscriptViewProps {
  text: string;
  fillerWords: {
    word: string;
    index: number;
    length: number;
  }[];
  isInterim?: boolean;
}

const TranscriptView = ({ 
  text, 
  fillerWords, 
  isInterim = false 
}: TranscriptViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillerPercentage, setFillerPercentage] = useState(0);

  useEffect(() => {
    // Calculate filler word percentage
    if (text) {
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      setFillerPercentage(wordCount > 0 ? fillerWords.length / wordCount : 0);
    } else {
      setFillerPercentage(0);
    }

    // Auto-scroll to bottom
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, fillerWords]);

  const getFillerCountClass = () => {
    if (fillerPercentage > 0.1) return 'text-red-500';
    if (fillerPercentage > 0.05) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Transcript</h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Filler words:</span>
          <span className={cn(getFillerCountClass(), "font-medium")}>
            {fillerWords.length} ({formatPercentage(fillerPercentage)})
          </span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className={cn(
          "w-full h-64 overflow-y-auto p-4 rounded-lg bg-white border transition-colors",
          isInterim ? "border-muted" : "border-muted"
        )}
      >
        {text ? (
          <FillerWordHighlighter text={text} fillerWords={fillerWords} />
        ) : (
          <p className="text-muted-foreground text-center py-12">
            {isInterim ? "Listening..." : "Your transcript will appear here"}
          </p>
        )}
      </div>
      
      {isInterim && text && (
        <div className="absolute bottom-3 right-3">
          <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptView;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
