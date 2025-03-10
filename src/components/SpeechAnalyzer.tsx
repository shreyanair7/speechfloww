
import { useState, useEffect, useRef } from 'react';
import RecordButton from './RecordButton';
import TranscriptView from './TranscriptView';
import ToneAnalysis from './ToneAnalysis';
import Dashboard from './Dashboard';
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
      
      // Save to history in localStorage
      const newRecording: RecordingEntry = {
        id: Date.now().toString(),
        date: new Date(),
        duration: recordingTime,
        text: transcript,
        fillerWordCount: result.fillerWords.length,
        clarity: result.toneAnalysis.clarity
      };
      
      // Get existing recordings
      const storedRecordings = localStorage.getItem('speechFlowRecordings');
      const recordings = storedRecordings ? JSON.parse(storedRecordings) : [];
      
      // Add new recording to the beginning of the array
      const updatedRecordings = [newRecording, ...recordings];
      
      // Save back to localStorage
      localStorage.setItem('speechFlowRecordings', JSON.stringify(updatedRecordings));
      
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
    <div className="w-full animate-fade-in">
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
          <div className="flex justify-center py-6">
            <RecordButton 
              isRecording={isRecording} 
              onToggleRecording={handleToggleRecording}
              recordingTime={recordingTime}
            />
          </div>
          
          <Dashboard 
            fillerWords={analysisResult.fillerWords}
            toneAnalysis={analysisResult.toneAnalysis}
            recordingTime={recordingTime}
            isRecording={isRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default SpeechAnalyzer;
