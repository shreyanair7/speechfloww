
// Format speech metrics for display
export const formatPace = (pace: number): string => {
  if (pace < 110) return 'Slow';
  if (pace < 150) return 'Moderate';
  if (pace < 190) return 'Fast';
  return 'Very Fast';
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

export const getScoreColor = (score: number): string => {
  if (score < 0.4) return 'text-red-500';
  if (score < 0.7) return 'text-amber-500';
  return 'text-green-500';
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getFillerWordSummary = (count: number): string => {
  if (count === 0) return 'Excellent! No filler words detected.';
  if (count < 3) return 'Very good! Minimal filler word usage.';
  if (count < 8) return 'Good. Some filler words detected.';
  if (count < 15) return 'Moderate filler word usage. Consider reducing.';
  return 'High filler word usage. Focus on reducing these words.';
};

export const getToneAnalysisSummary = (toneVariety: number): string => {
  if (toneVariety < 0.3) return 'Low tone variety. Try adding more vocal variation.';
  if (toneVariety < 0.6) return 'Moderate tone variety. Good foundation to build upon.';
  return 'Good tone variety. Your speech has natural rhythm.';
};

export const getOverallFeedback = (
  fillerWordCount: number, 
  clarity: number, 
  toneVariety: number,
  pace: number
): string => {
  const feedbacks: string[] = [];

  // Filler word feedback
  if (fillerWordCount > 10) {
    feedbacks.push('Work on reducing filler words to increase clarity.');
  } else if (fillerWordCount > 5) {
    feedbacks.push('You have a moderate use of filler words. With practice, you can reduce them further.');
  } else if (fillerWordCount > 0) {
    feedbacks.push('Excellent control of filler words. Keep it up!');
  } else {
    feedbacks.push('Perfect! No filler words detected.');
  }

  // Pace feedback
  if (pace < 100) {
    feedbacks.push('Your pace is slow. Try to speak a bit faster to maintain engagement.');
  } else if (pace > 180) {
    feedbacks.push('Your pace is very fast. Consider slowing down for better clarity.');
  } else if (pace > 160) {
    feedbacks.push('You speak at a brisk pace. Good for keeping interest, but ensure clarity isn\'t affected.');
  } else {
    feedbacks.push('You have an excellent speaking pace.');
  }

  // Tone variety feedback
  if (toneVariety < 0.4) {
    feedbacks.push('Add more variation to your tone to make your speech more engaging.');
  } else if (toneVariety > 0.7) {
    feedbacks.push('Great vocal variation! Your speech is dynamic and engaging.');
  }

  return feedbacks.join(' ');
};

// Generate tip based on the analysis
export const generateTip = (
  fillerWordCount: number,
  clarity: number,
  toneVariety: number,
  pace: number
): string => {
  const tips = [
    'Record yourself regularly and listen back to identify patterns.',
    'Practice pausing instead of using filler words.',
    'Prepare key points before speaking to reduce hesitation.',
    'Vary your sentence length to create natural rhythm.',
    'Speak slightly slower than feels natural when presenting.',
    'Emphasize important words to add variety to your tone.',
    'Use hand gestures to help pace your speech naturally.',
    'Take a deep breath before speaking to reduce anxiety and filler words.'
  ];
  
  // Choose a relevant tip based on the analysis
  if (fillerWordCount > 8) {
    return tips[1]; // Pausing tip
  } else if (toneVariety < 0.4) {
    return tips[3]; // Sentence variety tip
  } else if (pace > 170) {
    return tips[4]; // Slow down tip
  } else if (clarity < 0.6) {
    return tips[2]; // Preparation tip
  }
  
  // Return a random tip if no specific issues
  return tips[Math.floor(Math.random() * tips.length)];
};
