
import { useState, useEffect } from 'react';
import { formatDate, formatPercentage } from '@/utils/analysisUtils';
import TranscriptView from '@/components/TranscriptView';
import ToneAnalysis from '@/components/ToneAnalysis';
import { analyzeSpeech } from '@/utils/speechUtils';

interface RecordingEntry {
  id: string;
  date: Date;
  duration: number;
  text: string;
  fillerWordCount: number;
  clarity: number;
}

const History = () => {
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<RecordingEntry | null>(null);
  const [analysisResult, setAnalysisResult] = useState({
    text: '',
    fillerWords: [],
    toneAnalysis: {
      pace: 0,
      toneVariety: 0,
      engagement: 0,
      clarity: 0
    }
  });

  // Load recordings from localStorage on component mount
  useEffect(() => {
    const storedRecordings = localStorage.getItem('speechFlowRecordings');
    if (storedRecordings) {
      const parsedRecordings = JSON.parse(storedRecordings);
      
      // Convert string dates back to Date objects
      const formattedRecordings = parsedRecordings.map((recording: any) => ({
        ...recording,
        date: new Date(recording.date)
      }));
      
      setRecordings(formattedRecordings);
    }
  }, []);

  const handleSelectRecording = (recording: RecordingEntry) => {
    setSelectedRecording(recording);
    
    // Re-analyze the selected recording for detailed viewing
    const result = analyzeSpeech(recording.text, recording.duration);
    setAnalysisResult(result);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all your recording history? This cannot be undone.')) {
      localStorage.removeItem('speechFlowRecordings');
      setRecordings([]);
      setSelectedRecording(null);
    }
  };

  if (recordings.length === 0) {
    return (
      <div className="py-6 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Recording History</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            View and analyze your past recordings
          </p>
        </div>
        
        <div className="speechflow-card p-12 text-center">
          <p className="text-lg mb-4">You don't have any recordings yet.</p>
          <p className="text-muted-foreground mb-6">Head over to the Analyzer to record your first speech!</p>
          <a href="/analyzer" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Go to Analyzer
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Recording History</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          View and analyze your past recordings
        </p>
      </div>
      
      {selectedRecording ? (
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setSelectedRecording(null)}
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="w-5 h-5 mr-1"
              >
                <path 
                  fillRule="evenodd" 
                  d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" 
                  clipRule="evenodd" 
                />
              </svg>
              Back to history
            </button>
          </div>
          
          <div className="speechflow-card p-4">
            <h2 className="text-xl font-semibold mb-2">
              Recording from {formatDate(selectedRecording.date)}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Duration: {Math.floor(selectedRecording.duration / 60)}m {Math.floor(selectedRecording.duration % 60)}s • 
              {' '}{selectedRecording.fillerWordCount} filler words • 
              Clarity: {formatPercentage(selectedRecording.clarity)}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <TranscriptView 
                text={selectedRecording.text} 
                fillerWords={analysisResult.fillerWords}
                isInterim={false}
              />
              
              <ToneAnalysis toneAnalysis={analysisResult.toneAnalysis} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Recordings</h2>
            <button 
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-3">
            {recordings.map((recording) => (
              <div 
                key={recording.id}
                className="speechflow-card p-4 hover:cursor-pointer"
                onClick={() => handleSelectRecording(recording)}
              >
                <div className="flex justify-between items-center">
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
                    
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className="w-5 h-5 text-muted-foreground"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm line-clamp-1 text-muted-foreground">{recording.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
