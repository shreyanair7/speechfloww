
import { useState } from 'react';
import { formatDate, formatPercentage } from '@/utils/analysisUtils';

interface RecordingEntry {
  id: string;
  date: Date;
  duration: number;
  text: string;
  fillerWordCount: number;
  clarity: number;
}

interface HistoryViewProps {
  recordings: RecordingEntry[];
  onSelect: (recording: RecordingEntry) => void;
}

const HistoryView = ({ recordings, onSelect }: HistoryViewProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (recordings.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-medium mb-4">History</h3>
        <div className="p-6 border rounded-lg bg-white text-center">
          <p className="text-muted-foreground">No recordings yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Your recorded sessions will appear here.</p>
        </div>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">History</h3>
      
      <div className="space-y-3">
        {recordings.map((recording) => (
          <div 
            key={recording.id}
            className="border rounded-lg bg-white overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div 
              className="p-3 cursor-pointer flex justify-between items-center"
              onClick={() => toggleExpand(recording.id)}
            >
              <div>
                <p className="font-medium">{formatDate(recording.date)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(recording.duration / 60)}m {Math.floor(recording.duration % 60)}s • 
                  {' '}{recording.fillerWordCount} filler words
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Clarity</span>
                  <p className="font-medium">{formatPercentage(recording.clarity)}</p>
                </div>
                
                <button 
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label="Expand recording details"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className={`w-5 h-5 transition-transform duration-200 ${expandedId === recording.id ? 'rotate-180' : ''}`}
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {expandedId === recording.id && (
              <div className="p-3 pt-0 border-t border-muted bg-secondary/50 animate-slide-down">
                <p className="text-sm mb-3 line-clamp-3">{recording.text}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => onSelect(recording)}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
