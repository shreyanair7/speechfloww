
import { formatPercentage, getScoreColor, formatPace } from '@/utils/analysisUtils';

interface ToneAnalysisProps {
  toneAnalysis: {
    pace: number;
    toneVariety: number;
    engagement: number;
    clarity: number;
  };
}

const ToneAnalysis = ({ toneAnalysis }: ToneAnalysisProps) => {
  const renderMeter = (label: string, value: number, description: string) => {
    const scoreClass = getScoreColor(value);
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className={`text-sm font-medium ${scoreClass}`}>
            {formatPercentage(value)}
          </span>
        </div>
        
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out`}
            style={{ 
              width: `${value * 100}%`,
              background: value < 0.4 
                ? 'linear-gradient(90deg, #f87171, #fb923c)' 
                : value < 0.7 
                  ? 'linear-gradient(90deg, #fb923c, #facc15)' 
                  : 'linear-gradient(90deg, #4ade80, #22c55e)'
            }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Tone Analysis</h3>
      
      <div className="p-4 border rounded-lg bg-white">
        <div className="mb-4 pb-4 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Speaking Pace</span>
            <span className="text-sm font-medium">
              {Math.round(toneAnalysis.pace)} WPM
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatPace(toneAnalysis.pace)} 
            {toneAnalysis.pace < 110 ? ' - consider speaking faster' : 
             toneAnalysis.pace > 180 ? ' - consider slowing down' : 
             ' - good pace'}
          </p>
        </div>
        
        {renderMeter(
          "Vocal Variety", 
          toneAnalysis.toneVariety,
          "How varied your tone, pitch, and rhythm is"
        )}
        
        {renderMeter(
          "Engagement", 
          toneAnalysis.engagement,
          "How engaging your speech is perceived"
        )}
        
        {renderMeter(
          "Clarity", 
          toneAnalysis.clarity,
          "How clear your speech is (fewer filler words = higher clarity)"
        )}
      </div>
    </div>
  );
};

export default ToneAnalysis;
