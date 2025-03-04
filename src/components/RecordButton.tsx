
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RecordButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  recordingTime: number;
}

const RecordButton = ({ 
  isRecording, 
  onToggleRecording, 
  recordingTime 
}: RecordButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Start animation when recording starts
  useEffect(() => {
    if (isRecording) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <button
          onClick={onToggleRecording}
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 z-10",
            isRecording 
              ? "bg-destructive hover:bg-destructive/90" 
              : "bg-primary hover:bg-primary/90"
          )}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? (
            <div className="w-6 h-6 rounded-sm bg-white" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-white" />
          )}
        </button>
        
        {/* Ripple effect when recording */}
        {isAnimating && (
          <>
            <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ripple"></span>
            <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ripple" style={{ animationDelay: '0.5s' }}></span>
          </>
        )}
      </div>
      
      {isRecording && (
        <div className="mt-3 text-sm font-medium flex items-center">
          <span className="w-2 h-2 rounded-full bg-destructive mr-2 animate-pulse-light"></span>
          <span className="text-destructive">{formatTime(recordingTime)}</span>
        </div>
      )}
      
      <div className="mt-2 text-sm text-muted-foreground">
        {isRecording ? "Tap to stop" : "Tap to record"}
      </div>
    </div>
  );
};

export default RecordButton;
