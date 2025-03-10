
import { Link } from 'react-router-dom';
import { Mic, BarChart2, History, Settings } from 'lucide-react';

const Home = () => {
  return (
    <div className="py-6 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">Welcome to SpeechFlow</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Improve your speaking skills by analyzing filler words and speech patterns.
          Record your speech, get instant feedback, and track your progress over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link to="/analyzer" className="speechflow-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Speech Analyzer</h3>
          <p className="text-muted-foreground">Record and analyze your speech in real-time.</p>
        </Link>

        <Link to="/history" className="speechflow-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Recording History</h3>
          <p className="text-muted-foreground">Review your past recordings and progress.</p>
        </Link>

        <Link to="/analyzer" className="speechflow-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BarChart2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-muted-foreground">View detailed speech metrics and insights.</p>
        </Link>

        <Link to="/settings" className="speechflow-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Settings</h3>
          <p className="text-muted-foreground">Customize your SpeechFlow experience.</p>
        </Link>
      </div>

      <div className="speechflow-card p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li className="text-lg">
            <span className="font-medium">Record your speech</span>
            <p className="text-muted-foreground mt-1">
              Go to the Analyzer page and click the microphone button to start recording.
            </p>
          </li>
          <li className="text-lg">
            <span className="font-medium">Review the analysis</span>
            <p className="text-muted-foreground mt-1">
              After recording, see highlighted filler words and tone analysis metrics.
            </p>
          </li>
          <li className="text-lg">
            <span className="font-medium">Track your progress</span>
            <p className="text-muted-foreground mt-1">
              Review your history to see how your speaking improves over time.
            </p>
          </li>
        </ol>
      </div>

      <div className="flex justify-center">
        <Link 
          to="/analyzer" 
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Start Analyzing
        </Link>
      </div>
    </div>
  );
};

export default Home;
