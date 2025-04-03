
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SearchBox from './SearchBox';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-kids-blue flex items-center justify-center mr-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5Z" fill="white"/>
                <path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8V16C7 16.5523 6.55228 17 6 17C5.44772 17 5 16.5523 5 16V8Z" fill="white"/>
                <path d="M17 8C17 7.44772 17.4477 7 18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17C17.4477 17 17 16.5523 17 16V8Z" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-800">ActivityHub</span>
          </Link>

          {/* Search Box (visible only on medium and larger screens) */}
          <div className="hidden md:block">
            <SearchBox />
          </div>

          {/* Main navigation - desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'text-kids-blue' : 'text-gray-600 hover:text-kids-blue'}`}>
              Home
            </Link>
            <Link to="/activities" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/activities') ? 'text-kids-blue' : 'text-gray-600 hover:text-kids-blue'}`}>
              Activities
            </Link>
            {user && (
              <Link to="/saved" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/saved') ? 'text-kids-blue' : 'text-gray-600 hover:text-kids-blue'}`}>
                Saved
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link to="/profile">
                    <User size={16} />
                    {profile?.first_name || "Profile"}
                  </Link>
                </Button>
                <Button onClick={() => logout()} variant="outline">
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="ml-2 bg-kids-blue hover:bg-kids-blue/90">
                <Link to="/auth/login">
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="mb-4">
              <SearchBox />
            </div>
            <div className="space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/activities" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/activities') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Activities
              </Link>
              {user && (
                <Link 
                  to="/saved" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/saved') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Saved
                </Link>
              )}
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-kids-blue hover:bg-kids-blue/5"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
