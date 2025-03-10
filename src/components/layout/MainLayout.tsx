
import { Link, useLocation } from 'react-router-dom';
import { Mic, History, Settings, Home } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="speechflow-header py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">SpeechFlow</h1>
          </Link>
          
          <nav className="hidden md:flex gap-2">
            <Link 
              to="/" 
              className={`speechflow-nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/analyzer" 
              className={`speechflow-nav-item ${isActive('/analyzer') ? 'active' : ''}`}
            >
              <Mic className="w-4 h-4" />
              <span>Analyzer</span>
            </Link>
            <Link 
              to="/history" 
              className={`speechflow-nav-item ${isActive('/history') ? 'active' : ''}`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
            <Link 
              to="/settings" 
              className={`speechflow-nav-item ${isActive('/settings') ? 'active' : ''}`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10">
        <div className="flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center p-2">
            <Home className={`w-6 h-6 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/analyzer" className="flex flex-col items-center p-2">
            <Mic className={`w-6 h-6 ${isActive('/analyzer') ? 'text-primary' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Analyzer</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center p-2">
            <History className={`w-6 h-6 ${isActive('/history') ? 'text-primary' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">History</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center p-2">
            <Settings className={`w-6 h-6 ${isActive('/settings') ? 'text-primary' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 md:px-6 max-w-7xl mx-auto w-full mb-16 md:mb-0">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
