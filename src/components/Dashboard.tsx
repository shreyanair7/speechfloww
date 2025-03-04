
import { formatPercentage, getFillerWordSummary, getToneAnalysisSummary, generateTip } from '@/utils/analysisUtils';

interface DashboardProps {
  fillerWords: {
    word: string;
    index: number;
    length: number;
  }[];
  toneAnalysis: {
    pace: number;
    toneVariety: number;
    engagement: number;
    clarity: number;
  };
  recordingTime: number;
  isRecording: boolean;
}

const Dashboard = ({ fillerWords, toneAnalysis, recordingTime, isRecording }: DashboardProps) => {
  // Skip rendering stats if recording time is too short
  if (recordingTime < 3 && !isRecording) {
    return (
      <div className="w-full p-6 border rounded-lg bg-white text-center">
        <p className="text-muted-foreground">Recording too short for analysis.</p>
        <p className="text-sm text-muted-foreground mt-2">Try speaking for at least a few seconds.</p>
      </div>
    );
  }

  // Calculate some derived metrics
  const fillerWordsPerMinute = recordingTime > 0 
    ? (fillerWords.length / (recordingTime / 60)) 
    : 0;
  
  const tip = generateTip(
    fillerWords.length, 
    toneAnalysis.clarity, 
    toneAnalysis.toneVariety, 
    toneAnalysis.pace
  );

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Speech Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded-lg bg-white transition-all hover:shadow-md">
          <div className="flex flex-col h-full">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Filler Words</h4>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold mr-2">{fillerWords.length}</span>
              <span className="text-sm text-muted-foreground">
                ({formatPercentage(fillerWordsPerMinute)} per min)
              </span>
            </div>
            <p className="mt-auto text-xs pt-2">{getFillerWordSummary(fillerWords.length)}</p>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-white transition-all hover:shadow-md">
          <div className="flex flex-col h-full">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Overall Clarity</h4>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold mr-2">
                {formatPercentage(toneAnalysis.clarity)}
              </span>
            </div>
            <p className="mt-auto text-xs pt-2">
              {toneAnalysis.clarity > 0.8 
                ? "Excellent clarity in your speech!" 
                : toneAnalysis.clarity > 0.6 
                  ? "Good clarity, minimal distractions." 
                  : "Room for improvement in speech clarity."}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white mb-4">
        <h4 className="text-sm font-medium">Tone Analysis</h4>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          {getToneAnalysisSummary(toneAnalysis.toneVariety)}
        </p>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(toneAnalysis.pace)}
            </div>
            <div className="text-xs text-muted-foreground">Words/min</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatPercentage(toneAnalysis.toneVariety)}
            </div>
            <div className="text-xs text-muted-foreground">Variety</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatPercentage(toneAnalysis.engagement)}
            </div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>
      </div>
      
      {/* Improvement Tip */}
      <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <h4 className="text-sm font-medium flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-4 h-4 mr-1 text-primary"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z" 
              clipRule="evenodd" 
            />
          </svg>
          Improvement Tip
        </h4>
        <p className="text-sm mt-2">{tip}</p>
      </div>
    </div>
  );
};

export default Dashboard;
