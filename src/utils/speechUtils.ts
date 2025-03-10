interface SpeechAnalysisResult {
  text: string;
  fillerWords: {
    word: string;
    index: number;
    length: number;
  }[];
  toneAnalysis: {
    pace: number; // Words per minute
    toneVariety: number; // 0-1 scale
    engagement: number; // 0-1 scale
    clarity: number; // 0-1 scale
  };
}

// Dictionary of common filler words
export const fillerWordsDictionary = [
  "um", "uh", "er", "ah", "like", "you know", "so", "basically", "actually", 
  "literally", "just", "kind of", "sort of", "i mean", "right", "okay", "well"
];

// Start speech recognition
export const startSpeechRecognition = (
  onInterimResult: (text: string) => void,
  onFinalResult: (text: string) => void,
  onError: (error: string) => void
): SpeechRecognition | null => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  // Initialize speech recognition
  const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionConstructor();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        onFinalResult(finalTranscript);
      } else {
        interimTranscript += transcript;
        onInterimResult(finalTranscript + interimTranscript);
      }
    }
  };

  recognition.onerror = (event) => {
    onError(`Error occurred in recognition: ${event.error}`);
  };

  recognition.start();
  return recognition;
};

// Stop speech recognition
export const stopSpeechRecognition = (recognition: SpeechRecognition | null): void => {
  if (recognition) {
    recognition.stop();
  }
};

// Detect filler words in text
export const detectFillerWords = (text: string): { word: string; index: number; length: number }[] => {
  const fillerWordMatches: { word: string; index: number; length: number }[] = [];
  const lowerText = text.toLowerCase();
  
  fillerWordsDictionary.forEach(fillerWord => {
    let startIndex = 0;
    let index;
    
    while ((index = lowerText.indexOf(fillerWord, startIndex)) !== -1) {
      // Check if it's a whole word (surrounded by spaces, punctuation or beginning/end of text)
      const beforeChar = index === 0 ? '' : lowerText[index - 1];
      const afterChar = index + fillerWord.length >= lowerText.length ? '' : lowerText[index + fillerWord.length];
      
      const isWholeWord = 
        (beforeChar === '' || beforeChar === ' ' || /[.,;!?]/.test(beforeChar)) &&
        (afterChar === '' || afterChar === ' ' || /[.,;!?]/.test(afterChar));
      
      if (isWholeWord) {
        fillerWordMatches.push({
          word: fillerWord,
          index,
          length: fillerWord.length
        });
      }
      
      startIndex = index + fillerWord.length;
    }
  });
  
  return fillerWordMatches;
};

// Calculate speech metrics
export const analyzeSpeech = (text: string, durationInSeconds: number): SpeechAnalysisResult => {
  const fillerWords = detectFillerWords(text);
  
  // Count words (rough approximation)
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate pace (words per minute)
  const pace = wordCount / (durationInSeconds / 60);
  
  // Calculate the percentage of filler words
  const fillerWordPercentage = fillerWords.length / wordCount;
  
  // Experimental tone variety calculation (simplified)
  // In a real application, you would use more sophisticated analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengthVariety = sentences.length > 1 
    ? calculateVariety(sentences.map(s => s.trim().split(/\s+/).length))
    : 0.5;
  
  // Clarity score (inverse of filler word percentage with a baseline)
  const clarity = Math.max(0, Math.min(1, 1 - (fillerWordPercentage * 2)));
  
  // Engagement score (experimental composite score)
  // In a real application, you would use proper sentiment analysis and other metrics
  const engagement = (pace > 120 && pace < 160) ? 0.8 : 0.5;
  
  return {
    text,
    fillerWords,
    toneAnalysis: {
      pace,
      toneVariety: sentenceLengthVariety,
      engagement,
      clarity
    }
  };
};

// Helper function to calculate variety (0-1 scale)
const calculateVariety = (values: number[]): number => {
  if (values.length <= 1) return 0;
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Normalize to 0-1 scale with a cap
  return Math.min(1, range / 10);
};
