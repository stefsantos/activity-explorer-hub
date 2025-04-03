
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { Link } from 'react-router-dom';
import { Bookmark, LogIn, LogOut, Map } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isLoggedIn, login, logout, bookmarkedActivities } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Map className="text-brand-500" size={28} />
          <span className="font-bold text-xl text-gray-800">ActivityHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-brand-500 transition-colors">
            Home
          </Link>
          <Link to="/activities" className="text-gray-700 hover:text-brand-500 transition-colors">
            Activities
          </Link>
          {isLoggedIn && (
            <Link to="/saved" className="text-gray-700 hover:text-brand-500 transition-colors flex items-center">
              <Bookmark className="mr-1" size={16} />
              Saved ({bookmarkedActivities.length})
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={logout}
            >
              <LogOut className="mr-1" size={16} />
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex items-center bg-brand-500 hover:bg-brand-600"
              onClick={login}
            >
              <LogIn className="mr-1" size={16} />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
