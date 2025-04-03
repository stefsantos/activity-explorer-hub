
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { Link } from 'react-router-dom';
import { Bookmark, LogIn, LogOut, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isLoggedIn, login, logout, bookmarkedActivities } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-kids-teal flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5Z" fill="white"/>
              <path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8V16C7 16.5523 6.55228 17 6 17C5.44772 17 5 16.5523 5 16V8Z" fill="white"/>
              <path d="M17 8C17 7.44772 17.4477 7 18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17C17.4477 17 17 16.5523 17 16V8Z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-800">ActivityHub</span>
        </Link>
        
        <div className="hidden md:flex relative w-1/3 mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for activities, parks, events, and fun!"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-kids-teal focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <Link to="/saved" className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-700 hover:text-kids-teal"
                >
                  <Bookmark className="mr-1" size={16} />
                  <span className="hidden sm:inline">Saved</span>
                </Button>
                {bookmarkedActivities.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-kids-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {bookmarkedActivities.length}
                  </span>
                )}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center border-kids-orange text-kids-orange hover:bg-kids-orange hover:text-white"
                onClick={logout}
              >
                <LogOut className="mr-1" size={16} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="flex items-center bg-kids-teal hover:bg-kids-teal/90 text-white rounded-full px-6"
              onClick={login}
            >
              <LogIn className="mr-1" size={16} />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
