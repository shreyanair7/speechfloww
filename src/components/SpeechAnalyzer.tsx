
import { useState, useEffect, useRef } from 'react';
import RecordButton from './RecordButton';
import TranscriptView from './TranscriptView';
import ToneAnalysis from './ToneAnalysis';
import Dashboard from './Dashboard';
import HistoryView from './HistoryView';
import { startSpeechRecognition, stopSpeechRecognition, analyzeSpeech } from '@/utils/speechUtils';
import { useToast } from "@/components/ui/use-toast";

interface RecordingEntry {
  id: string;
  date: Date;
  duration: number;
  text: string;
  fillerWordCount: number;
  clarity: number;
}

const SpeechAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeSpeech>>({
    text: '',
    fillerWords: [],
    toneAnalysis: {
      pace: 0,
      toneVariety: 0,
      engagement: 0,
      clarity: 0
    }
  });
  const [recordings, setRecordings] = useState<RecordingEntry[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<RecordingEntry | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Handle toggle recording
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Start recording
  const startRecording = () => {
    // Reset states
    setTranscript('');
    setInterimTranscript('');
    setRecordingTime(0);
    
    // Start speech recognition
    recognitionRef.current = startSpeechRecognition(
      (text) => setInterimTranscript(text),
      (text) => setTranscript(text),
      (error) => {
        toast({
          title: "Speech Recognition Error",
          description: error,
          variant: "destructive"
        });
        stopRecording();
      }
    );
    
    // Start timer
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setRecordingTime(elapsed);
      }
    }, 100);
    
    setIsRecording(true);
    
    // Show toast
    toast({
      title: "Recording Started",
      description: "Speak clearly into your microphone."
    });
  };

  // Stop recording
  const stopRecording = () => {
    // Stop speech recognition
    stopSpeechRecognition(recognitionRef.current);
    recognitionRef.current = null;
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    setInterimTranscript('');
    
    // Only analyze if we have transcript
    if (transcript.trim().length > 0) {
      // Analyze the speech
      const result = analyzeSpeech(transcript, recordingTime);
      setAnalysisResult(result);
      
      // Save to history
      const newRecording: RecordingEntry = {
        id: Date.now().toString(),
        date: new Date(),
        duration: recordingTime,
        text: transcript,
        fillerWordCount: result.fillerWords.length,
        clarity: result.toneAnalysis.clarity
      };
      
      setRecordings([newRecording, ...recordings]);
      
      // Show toast
      toast({
        title: "Analysis Complete",
        description: `Found ${result.fillerWords.length} filler words in your speech.`
      });
    } else {
      toast({
        title: "Recording Stopped",
        description: "No speech was detected."
      });
    }
  };

  // Handle selecting a recording from history
  const handleSelectRecording = (recording: RecordingEntry) => {
    setSelectedRecording(recording);
    
    // Re-analyze the selected recording for detailed viewing
    const result = analyzeSpeech(recording.text, recording.duration);
    setAnalysisResult(result);
    setTranscript(recording.text);
  };

  // Handle back to current
  const handleBackToCurrent = () => {
    setSelectedRecording(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeechRecognition(recognitionRef.current);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        {selectedRecording ? (
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={handleBackToCurrent}
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
              Back to current
            </button>
          </div>
        ) : null}
        
        <h1 className="text-3xl font-bold tracking-tight">Speech Analyzer</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          {selectedRecording 
            ? "Viewing past recording from " + new Date(selectedRecording.date).toLocaleString()
            : "Improve your speaking by analyzing filler words and tone clarity"}
        </p>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-8">
          <TranscriptView 
            text={isRecording ? interimTranscript : transcript} 
            fillerWords={analysisResult.fillerWords}
            isInterim={isRecording}
          />
          
          <ToneAnalysis toneAnalysis={analysisResult.toneAnalysis} />
        </div>
        
        <div className="space-y-8">
          {!selectedRecording && (
            <div className="flex justify-center py-6">
              <RecordButton 
                isRecording={isRecording} 
                onToggleRecording={handleToggleRecording}
                recordingTime={recordingTime}
              />
            </div>
          )}
          
          <Dashboard 
            fillerWords={analysisResult.fillerWords}
            toneAnalysis={analysisResult.toneAnalysis}
            recordingTime={recordingTime}
            isRecording={isRecording}
          />
          
          {!selectedRecording && recordings.length > 0 && (
            <HistoryView 
              recordings={recordings} 
              onSelect={handleSelectRecording}
            />
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-6 border-t">
        <p>Use this tool regularly to track your improvement and reduce filler words.</p>
      </div>
    </div>
  );
};

export default SpeechAnalyzer;
