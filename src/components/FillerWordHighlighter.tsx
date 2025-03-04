
import { cn } from '@/lib/utils';

interface FillerWordHighlighterProps {
  text: string;
  fillerWords: {
    word: string;
    index: number;
    length: number;
  }[];
}

const FillerWordHighlighter = ({ text, fillerWords }: FillerWordHighlighterProps) => {
  // If there are no filler words or no text, just return the text
  if (fillerWords.length === 0 || !text) {
    return <p className="text-foreground leading-relaxed">{text}</p>;
  }

  // Sort filler words by index, from highest to lowest
  // This helps us build the text from end to beginning to avoid index shifts
  const sortedFillerWords = [...fillerWords].sort((a, b) => b.index - a.index);

  // Build text parts with highlights
  let result = text;
  let parts: JSX.Element[] = [];

  // Start from the end to preserve indices
  sortedFillerWords.forEach((filler) => {
    const beforeFiller = result.substring(0, filler.index);
    const fillerText = result.substring(filler.index, filler.index + filler.length);
    const afterFiller = result.substring(filler.index + filler.length);

    result = beforeFiller;
    
    // Add the parts after the filler word and the highlighted filler word
    parts = [
      <span key={`after-${filler.index}`} className="text-foreground">{afterFiller}</span>,
      <span 
        key={`filler-${filler.index}`} 
        className="text-foreground bg-orange-200 px-1 rounded mx-0.5 font-medium"
      >
        {fillerText}
      </span>,
      ...parts
    ];
  });

  // Add the remaining text (before the first filler word)
  parts = [<span key="start" className="text-foreground">{result}</span>, ...parts];

  return (
    <p className="leading-relaxed font-normal">
      {parts}
    </p>
  );
};

export default FillerWordHighlighter;
