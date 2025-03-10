
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fillerWordsDictionary } from '@/utils/speechUtils';

const Settings = () => {
  const [threshold, setThreshold] = useState(0.05);
  const [customFillerWords, setCustomFillerWords] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  // Load settings on component mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('speechFlowSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setThreshold(settings.threshold || 0.05);
      setCustomFillerWords(settings.customFillerWords || '');
      setDarkMode(settings.darkMode || false);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      threshold,
      customFillerWords,
      darkMode
    };
    
    localStorage.setItem('speechFlowSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      threshold: 0.05,
      customFillerWords: '',
      darkMode: false
    };
    
    setThreshold(defaultSettings.threshold);
    setCustomFillerWords(defaultSettings.customFillerWords);
    setDarkMode(defaultSettings.darkMode);
    
    localStorage.setItem('speechFlowSettings', JSON.stringify(defaultSettings));
    
    toast({
      title: "Settings reset",
      description: "Your preferences have been reset to defaults."
    });
  };

  return (
    <div className="py-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Customize your SpeechFlow experience
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="speechflow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Speech Recognition</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Filler Word Threshold</label>
            <input 
              type="range" 
              min="0.01" 
              max="0.2" 
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low ({threshold * 100}%)</span>
              <span>High</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Adjust how sensitive the filler word detection should be
            </p>
          </div>
        </div>
        
        <div className="speechflow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Filler Words</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Default Filler Words</label>
            <div className="p-3 bg-secondary rounded-md text-sm">
              <p className="text-muted-foreground mb-2">The following words are detected by default:</p>
              <div className="flex flex-wrap gap-2">
                {fillerWordsDictionary.map((word) => (
                  <span key={word} className="px-2 py-1 bg-primary/10 rounded-md">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Custom Filler Words</label>
            <textarea
              value={customFillerWords}
              onChange={(e) => setCustomFillerWords(e.target.value)}
              placeholder="Add your own filler words, separated by commas"
              className="w-full p-2 border rounded-md h-24"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add your own words to detect, separated by commas (e.g., "though, anyway, whatever")
            </p>
          </div>
        </div>
        
        <div className="speechflow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
